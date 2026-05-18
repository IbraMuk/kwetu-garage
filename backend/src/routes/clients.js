const express = require('express');
const { body, validationResult } = require('express-validator');
const Client = require('../models/Client');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Toutes les routes nécessitent une authentification
// Désactivé temporairement pour le développement
// router.use(auth);

// Créer un client
router.post('/', [
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone('any'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await Client.create(req.body);
    res.status(201).json({
      message: 'Client créé avec succès.',
      client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Obtenir tous les clients
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const clients = await Client.findAll(search);
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Obtenir un client par son ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Mettre à jour un client
router.put('/:id', [
  body('first_name').optional().notEmpty().trim(),
  body('last_name').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone('any'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await Client.update(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }

    res.json({
      message: 'Client mis à jour avec succès.',
      client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Supprimer un client
router.delete('/:id', async (req, res) => {
  try {
    const success = await Client.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Client non trouvé.' });
    }

    res.json({ message: 'Client supprimé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Obtenir les véhicules d'un client
router.get('/:id/vehicles', async (req, res) => {
  try {
    const vehicles = await Client.getVehicles(req.params.id);
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Obtenir les factures d'un client
router.get('/:id/invoices', async (req, res) => {
  try {
    const invoices = await Client.getInvoices(req.params.id);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
