const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const orders = req.user.role === 'admin' || req.user.role === 'manager'
      ? await Order.findAll(status)
      : await Order.findByUserId(req.user.id);
    res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
  }
});

router.get('/:id', auth, [
  param('id').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée.' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Accès interdit.' });
    }

    res.json({ data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
});

router.post('/', auth, [
  body('client_name').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('address').notEmpty().trim(),
  body('items').isArray({ min: 1 }),
  body('items.*.part_id').isUUID(),
  body('items.*.part_name').notEmpty().trim(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.unit_price').isFloat({ min: 0 }),
  body('total_amount').isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.create({
      user_id: req.user.id,
      client_name: req.body.client_name,
      phone: req.body.phone,
      address: req.body.address,
      items: req.body.items,
      total_amount: req.body.total_amount,
      notes: req.body.notes,
    });

    res.status(201).json({ message: 'Commande créée avec succès.', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande.' });
  }
});

router.patch('/:id/status', auth, [
  param('id').isUUID(),
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Seuls les admins/managers peuvent changer le statut.' });
    }

    const order = await Order.updateStatus(req.params.id, req.body.status);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée.' });
    }

    res.json({ message: 'Statut mis à jour.', data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

module.exports = router;
