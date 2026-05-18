const express = require("express");
const { body, validationResult } = require("express-validator");
const Invoice = require("../models/Invoice");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Toutes les routes nécessitent une authentification
// Désactivé temporairement pour le développement
// router.use(auth);

// Créer une facture
router.post(
  "/",
  [
    body("client_id").isUUID(),
    body("repair_id").optional().isUUID(),
    body("due_date").optional().isISO8601(),
    body("total_amount").isFloat({ min: 0 }),
    body("status").optional().isIn(["pending", "paid", "overdue", "cancelled"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Générer un numéro de facture automatiquement
      const invoice_number = await Invoice.generateInvoiceNumber();

      const invoiceData = {
        ...req.body,
        invoice_number,
      };

      const invoice = await Invoice.create(invoiceData);
      res.status(201).json({
        message: "Facture créée avec succès.",
        invoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir toutes les factures
router.get("/", async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      client_id: req.query.client_id,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key],
    );

    const invoices = await Invoice.findAll(filters);
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir une facture par son ID
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée." });
    }
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour une facture
router.put(
  "/:id",
  [
    body("client_id").optional().isUUID(),
    body("repair_id").optional().isUUID(),
    body("due_date").optional().isISO8601(),
    body("total_amount").optional().isFloat({ min: 0 }),
    body("status").optional().isIn(["pending", "paid", "overdue", "cancelled"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const invoice = await Invoice.update(req.params.id, req.body);
      if (!invoice) {
        return res.status(404).json({ error: "Facture non trouvée." });
      }

      res.json({
        message: "Facture mise à jour avec succès.",
        invoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Supprimer une facture
router.delete("/:id", async (req, res) => {
  try {
    const success = await Invoice.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Facture non trouvée." });
    }

    res.json({ message: "Facture supprimée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Mettre à jour le statut d'une facture
router.patch(
  "/:id/status",
  [body("status").isIn(["pending", "paid", "overdue", "cancelled"])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const invoice = await Invoice.updateStatus(req.params.id, status);
      if (!invoice) {
        return res.status(404).json({ error: "Facture non trouvée." });
      }

      res.json({
        message: "Statut mis à jour avec succès.",
        invoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },
);

// Obtenir les factures impayées en retard
router.get("/alerts/overdue", async (req, res) => {
  try {
    const invoices = await Invoice.getUnpaidInvoices();
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir les statistiques de revenus
router.get("/stats/revenue", async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const stats = await Invoice.getRevenueStats(period);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Obtenir la dette d'un client
router.get("/clients/:id/debt", async (req, res) => {
  try {
    const debt = await Invoice.getClientDebt(req.params.id);
    res.json({ client_id: req.params.id, total_debt: debt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Générer un numéro de facture
router.get("/generate/number", async (req, res) => {
  try {
    const invoiceNumber = await Invoice.generateInvoiceNumber();
    res.json({ invoice_number: invoiceNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
