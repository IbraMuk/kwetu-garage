const express = require("express");
const { body, validationResult } = require("express-validator");
const Repair = require("../models/Repair");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Toutes les routes nécessitent une authentification
// Désactivé temporairement pour le développement
// router.use(auth);

// Créer une réparation
router.post(
  "/",
  [
    body("vehicle_id").isUUID(),
    body("mechanic_id").optional().isUUID(),
    body("description").notEmpty().trim(),
    body("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
    body("start_date").optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const repair = await Repair.create(req.body);
      res.status(201).json({
        message: "Réparation créée avec succès.",
        repair,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir toutes les réparations
router.get("/", async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      mechanic_id: req.query.mechanic_id,
      vehicle_id: req.query.vehicle_id,
      client_id: req.query.client_id,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );

    const repairs = await Repair.findAll(filters);
    res.json(repairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir une réparation par son ID
router.get("/:id", async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) {
      return res.status(404).json({ error: "Réparation non trouvée." });
    }
    res.json(repair);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour une réparation
router.put(
  "/:id",
  [
    body("vehicle_id").optional().isUUID(),
    body("mechanic_id").optional().isUUID(),
    body("description").optional().notEmpty().trim(),
    body("status")
      .optional()
      .isIn(["pending", "in_progress", "completed", "cancelled"]),
    body("start_date").optional().isISO8601(),
    body("end_date").optional().isISO8601(),
    body("total_cost").optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const repair = await Repair.update(req.params.id, req.body);
      if (!repair) {
        return res.status(404).json({ error: "Réparation non trouvée." });
      }

      res.json({
        message: "Réparation mise à jour avec succès.",
        repair,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Supprimer une réparation
router.delete("/:id", async (req, res) => {
  try {
    const success = await Repair.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Réparation non trouvée." });
    }

    res.json({ message: "Réparation supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour le statut d'une réparation
router.patch(
  "/:id/status",
  [body("status").isIn(["pending", "in_progress", "completed", "cancelled"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const repair = await Repair.updateStatus(req.params.id, status);
      if (!repair) {
        return res.status(404).json({ error: "Réparation non trouvée." });
      }

      res.json({
        message: "Statut mis à jour avec succès.",
        repair,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Ajouter une pièce à une réparation
router.post(
  "/:id/parts",
  [
    body("part_id").isUUID(),
    body("quantity").isInt({ min: 1 }),
    body("unit_price").isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { part_id, quantity, unit_price } = req.body;
      const repairPart = await Repair.addPart(
        req.params.id,
        part_id,
        quantity,
        unit_price,
      );

      res.status(201).json({
        message: "Pièce ajoutée avec succès.",
        repairPart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir les pièces d'une réparation
router.get("/:id/parts", async (req, res) => {
  try {
    const parts = await Repair.getParts(req.params.id);
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir les statistiques des réparations
router.get("/stats/summary", async (req, res) => {
  try {
    const stats = await Repair.getStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
