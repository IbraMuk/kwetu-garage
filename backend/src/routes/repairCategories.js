const express = require('express');
const { body, param, validationResult } = require('express-validator');
const RepairCategory = require('../models/RepairCategory');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Lister toutes les catégories avec leurs sous-catégories
router.get('/', async (req, res) => {
  try {
    const categories = await RepairCategory.findAll();
    res.json({ data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

// Obtenir une catégorie par ID
router.get('/:id', [param('id').isUUID()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const category = await RepairCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }
    res.json({ data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Créer une catégorie
router.post('/', [
  body('name').notEmpty().trim(),
  body('icon').optional().trim(),
  body('display_order').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const category = await RepairCategory.create(req.body);
    res.status(201).json({ message: 'Catégorie créée.', data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création.' });
  }
});

// Ajouter une sous-catégorie
router.post('/:id/subcategories', [
  param('id').isUUID(),
  body('name').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const sub = await RepairCategory.createSubcategory(req.params.id, req.body.name);
    res.status(201).json({ message: 'Sous-catégorie créée.', data: sub });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création.' });
  }
});

// Mettre à jour une catégorie
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().notEmpty().trim(),
  body('icon').optional().trim(),
  body('display_order').optional().isInt({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const category = await RepairCategory.update(req.params.id, req.body);
    if (!category) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }
    res.json({ message: 'Catégorie mise à jour.', data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Supprimer une catégorie
router.delete('/:id', [param('id').isUUID()], async (req, res) => {
  try {
    const success = await RepairCategory.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }
    res.json({ message: 'Catégorie supprimée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Supprimer une sous-catégorie
router.delete('/subcategories/:id', [param('id').isUUID()], async (req, res) => {
  try {
    const success = await RepairCategory.deleteSubcategory(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Sous-catégorie non trouvée.' });
    }
    res.json({ message: 'Sous-catégorie supprimée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
