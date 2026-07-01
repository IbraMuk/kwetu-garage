const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Assistance = require('../models/Assistance');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const requests = req.user.role === 'admin' || req.user.role === 'manager'
      ? await Assistance.findAll(status)
      : await Assistance.findByUserId(req.user.id);
    res.json({ data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
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

    const request = await Assistance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }

    if (request.user_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Accès interdit.' });
    }

    res.json({ data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la demande.' });
  }
});

router.post('/', auth, [
  body('client_name').notEmpty().trim(),
  body('phone').notEmpty().trim(),
  body('location').notEmpty().trim(),
  body('issue_type').isIn(['breakdown', 'towing']),
  body('description').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const request = await Assistance.create({
      user_id: req.user.id,
      client_name: req.body.client_name,
      phone: req.body.phone,
      location: req.body.location,
      issue_type: req.body.issue_type,
      description: req.body.description,
    });

    res.status(201).json({ message: 'Demande de dépannage envoyée.', data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la demande.' });
  }
});

router.patch('/:id/status', auth, [
  param('id').isUUID(),
  body('status').isIn(['pending', 'in_progress', 'resolved', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Seuls les admins/managers peuvent changer le statut.' });
    }

    const request = await Assistance.updateStatus(req.params.id, req.body.status);
    if (!request) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }

    res.json({ message: 'Statut mis à jour.', data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

module.exports = router;
