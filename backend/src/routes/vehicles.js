const express = require("express");
const { body, validationResult } = require("express-validator");
const Vehicle = require("../models/Vehicle");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Toutes les routes nécessitent une authentification
// Désactivé temporairement pour le développement
// router.use(auth);

// Créer un véhicule
router.post(
  "/",
  [
    body("client_id").isUUID(),
    body("make").notEmpty().trim(),
    body("model").notEmpty().trim(),
    body("year").isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
    body("license_plate").notEmpty().trim(),
    body("vin").optional().isLength({ min: 17, max: 17 }),
    body("mileage").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const vehicle = await Vehicle.create(req.body);
      res.status(201).json({
        message: "Véhicule créé avec succès.",
        vehicle,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir tous les véhicules
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const vehicles = await Vehicle.findAll(search);
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir un véhicule par son ID
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Véhicule non trouvé." });
    }
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour un véhicule
router.put(
  "/:id",
  [
    body("client_id").optional().isUUID(),
    body("make").optional().notEmpty().trim(),
    body("model").optional().notEmpty().trim(),
    body("year")
      .optional()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
    body("license_plate").optional().notEmpty().trim(),
    body("vin").optional().isLength({ min: 17, max: 17 }),
    body("mileage").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const vehicle = await Vehicle.update(req.params.id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: "Véhicule non trouvé." });
      }

      res.json({
        message: "Véhicule mis à jour avec succès.",
        vehicle,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Supprimer un véhicule
router.delete("/:id", async (req, res) => {
  try {
    const success = await Vehicle.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Véhicule non trouvé." });
    }

    res.json({ message: "Véhicule supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir les réparations d'un véhicule
router.get("/:id/repairs", async (req, res) => {
  try {
    const repairs = await Vehicle.getRepairs(req.params.id);
    res.json(repairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour le kilométrage d'un véhicule
router.patch(
  "/:id/mileage",
  [body("mileage").isInt({ min: 0 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { mileage } = req.body;
      const vehicle = await Vehicle.updateMileage(req.params.id, mileage);
      if (!vehicle) {
        return res.status(404).json({ error: "Véhicule non trouvé." });
      }

      res.json({
        message: "Kilométrage mis à jour avec succès.",
        vehicle,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

module.exports = router;
