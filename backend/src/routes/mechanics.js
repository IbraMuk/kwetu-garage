const express = require("express");
const { body, validationResult } = require("express-validator");
const Mechanic = require("../models/Mechanic");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const mechanics = await Mechanic.findAll();
    res.json(mechanics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ error: "Mécanicien introuvable." });
    }
    res.json(mechanic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

router.post(
  "/",
  [
    body("first_name").notEmpty().trim(),
    body("last_name").notEmpty().trim(),
    body("email").isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("speciality").optional().trim(),
    body("hourly_rate").optional().isFloat({ min: 0 }),
    body("is_available").optional().isBoolean(),
    body("hire_date").optional().isISO8601(),
    body("password").optional().isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const mechanic = await Mechanic.create(req.body);
      res.status(201).json({
        message: "Mécanicien créé avec succès.",
        mechanic,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "23505") {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

router.put(
  "/:id",
  [
    body("speciality").optional().trim(),
    body("hourly_rate").optional().isFloat({ min: 0 }),
    body("is_available").optional().isBoolean(),
    body("hire_date").optional().isISO8601(),
    body("phone").optional().trim(),
    body("is_active").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const mechanic = await Mechanic.update(req.params.id, req.body);
      if (!mechanic) {
        return res.status(404).json({ error: "Mécanicien introuvable." });
      }

      res.json({
        message: "Mécanicien mis à jour avec succès.",
        mechanic,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Mechanic.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Mécanicien introuvable." });
    }
    res.json({ message: "Mécanicien supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
