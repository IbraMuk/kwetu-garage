const express = require("express");
const { body, validationResult } = require("express-validator");
const Part = require("../models/Part");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Toutes les routes nécessitent une authentification
// Désactivé temporairement pour le développement
// router.use(auth);

// Créer une pièce
router.post(
  "/",
  [
    body("name").notEmpty().trim(),
    body("reference").optional().notEmpty().trim(),
    body("description").optional().trim(),
    body("price").isFloat({ min: 0 }),
    body("stock_quantity").optional().isInt({ min: 0 }),
    body("min_stock_level").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const part = await Part.create(req.body);
      res.status(201).json({
        message: "Pièce créée avec succès.",
        part,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir toutes les pièces
router.get("/", async (req, res) => {
  try {
    const { search, low_stock } = req.query;
    const parts = await Part.findAll(search, low_stock === "true");
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir une pièce par son ID
router.get("/:id", async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ error: "Pièce non trouvée." });
    }
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour une pièce
router.put(
  "/:id",
  [
    body("name").optional().notEmpty().trim(),
    body("reference").optional().notEmpty().trim(),
    body("description").optional().trim(),
    body("price").optional().isFloat({ min: 0 }),
    body("stock_quantity").optional().isInt({ min: 0 }),
    body("min_stock_level").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const part = await Part.update(req.params.id, req.body);
      if (!part) {
        return res.status(404).json({ error: "Pièce non trouvée." });
      }

      res.json({
        message: "Pièce mise à jour avec succès.",
        part,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Supprimer une pièce
router.delete("/:id", async (req, res) => {
  try {
    const success = await Part.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Pièce non trouvée." });
    }

    res.json({ message: "Pièce supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour le stock d'une pièce
router.patch("/:id/stock", [body("quantity").isInt()], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;
    const part = await Part.updateStock(req.params.id, quantity);
    if (!part) {
      return res.status(404).json({ error: "Pièce non trouvée." });
    }

    res.json({
      message: "Stock mis à jour avec succès.",
      part,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir les pièces avec stock faible
router.get("/alerts/low-stock", async (req, res) => {
  try {
    const parts = await Part.getLowStockParts();
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir les statistiques d'utilisation d'une pièce
router.get("/:id/stats", async (req, res) => {
  try {
    const stats = await Part.getUsageStats(req.params.id);
    if (!stats) {
      return res.status(404).json({ error: "Pièce non trouvée." });
    }
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Vérifier la disponibilité d'une pièce
router.get("/:id/availability", async (req, res) => {
  try {
    const { quantity } = req.query;
    const neededQuantity = parseInt(quantity) || 1;

    const isAvailable = await Part.checkAvailability(
      req.params.id,
      neededQuantity,
    );
    res.json({ available: isAvailable, needed: neededQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
