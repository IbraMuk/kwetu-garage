const express = require("express");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");
const { auth } = require("../middleware/auth");

const LOGO_PATH = path.join(__dirname, "..", "assets", "logo.png");

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

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

// Générer un PDF de facture
router.get("/:id/pdf", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée." });
    }

    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoice.invoice_number}.pdf"`);
      res.send(pdfData);
    });

    const pageWidth = doc.page.width;
    const marginX = 50;
    const contentWidth = pageWidth - marginX * 2;

    const primaryColor = "#2563eb";
    const darkColor = "#1e293b";
    const grayColor = "#64748b";
    const lightGray = "#f1f5f9";
    const borderColor = "#e2e8f0";

    const statusColors = {
      pending: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
      paid: { bg: "#ecfdf5", text: "#047857", border: "#a7f3d0" },
      overdue: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
      cancelled: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
    };
    const statusLabels = {
      pending: "EN ATTENTE",
      paid: "PAYÉE",
      overdue: "EN RETARD",
      cancelled: "ANNULÉE",
    };
    const statusStyle = statusColors[invoice.status] || statusColors.pending;

    // ===== Bande d'en-tête =====
    doc.rect(0, 0, pageWidth, 150).fill(darkColor);

    // Logo à gauche
    let textStartX = marginX;
    if (fs.existsSync(LOGO_PATH)) {
      try {
        doc.image(LOGO_PATH, marginX, 35, { width: 80, height: 80, fit: [80, 80] });
        textStartX = marginX + 95;
      } catch (e) {
        // Ignore logo errors, fallback to text-only header
      }
    }

    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("KWETU GARAGE", textStartX, 45);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#cbd5e1")
      .text("Votre garage de confiance", textStartX, 72)
      .text("contact@kwetugarage.com  |  +243 000 000 000", textStartX, 88);

    // Titre FACTURE à droite
    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .fillColor("#ffffff")
      .text("FACTURE", 0, 45, { align: "right", width: pageWidth - marginX });
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#cbd5e1")
      .text(`N° ${invoice.invoice_number}`, 0, 78, { align: "right", width: pageWidth - marginX });

    let cursorY = 180;

    // ===== Badge de statut =====
    const badgeText = statusLabels[invoice.status] || invoice.status.toUpperCase();
    const badgeWidth = doc.font("Helvetica-Bold").fontSize(10).widthOfString(badgeText) + 24;
    doc
      .roundedRect(pageWidth - marginX - badgeWidth, cursorY, badgeWidth, 22, 11)
      .fillAndStroke(statusStyle.bg, statusStyle.border);
    doc
      .fillColor(statusStyle.text)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(badgeText, pageWidth - marginX - badgeWidth, cursorY + 6, { width: badgeWidth, align: "center" });

    // ===== Infos facture (gauche) et Client (droite) =====
    const colWidth = contentWidth / 2 - 15;

    doc
      .fillColor(grayColor)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("INFORMATIONS FACTURE", marginX, cursorY, { width: colWidth });

    let leftY = cursorY + 18;
    doc.font("Helvetica").fontSize(10).fillColor(darkColor);
    doc.text(`Date d'émission :`, marginX, leftY);
    doc.font("Helvetica-Bold").text(new Date(invoice.issue_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), marginX + 100, leftY);
    leftY += 18;
    doc.font("Helvetica").text(`Date d'échéance :`, marginX, leftY);
    doc.font("Helvetica-Bold").text(
      invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Non définie',
      marginX + 100,
      leftY
    );

    const clientX = marginX + colWidth + 30;
    doc
      .fillColor(grayColor)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("FACTURÉ À", clientX, cursorY, { width: colWidth });

    let rightY = cursorY + 18;
    const clientName = `${invoice.first_name || ''} ${invoice.last_name || ''}`.trim() || 'Client';
    doc.fillColor(darkColor).font("Helvetica-Bold").fontSize(11).text(clientName, clientX, rightY, { width: colWidth });
    rightY += 16;
    if (invoice.is_professional && invoice.company_name) {
      doc.font("Helvetica").fontSize(10).fillColor(grayColor).text(invoice.company_name, clientX, rightY, { width: colWidth });
      rightY += 14;
    }
    if (invoice.address) {
      doc.font("Helvetica").fontSize(10).fillColor(grayColor).text(invoice.address, clientX, rightY, { width: colWidth });
      rightY += 14;
    }
    if (invoice.email) {
      doc.font("Helvetica").fontSize(10).fillColor(grayColor).text(invoice.email, clientX, rightY, { width: colWidth });
      rightY += 14;
    }
    if (invoice.phone) {
      doc.font("Helvetica").fontSize(10).fillColor(grayColor).text(invoice.phone, clientX, rightY, { width: colWidth });
      rightY += 14;
    }

    cursorY = Math.max(leftY + 30, rightY + 20);

    // ===== Séparateur =====
    doc.moveTo(marginX, cursorY).lineTo(pageWidth - marginX, cursorY).lineWidth(1).strokeColor(borderColor).stroke();
    cursorY += 25;

    // ===== Tableau des prestations =====
    const tableTop = cursorY;
    const descColX = marginX;
    const amountColX = pageWidth - marginX - 120;
    const rowHeight = 30;

    doc.rect(marginX, tableTop, contentWidth, rowHeight).fill(lightGray);
    doc
      .fillColor(grayColor)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("DESCRIPTION", descColX + 12, tableTop + 10)
      .text("MONTANT", amountColX, tableTop + 10, { width: 108, align: "right" });

    cursorY = tableTop + rowHeight;

    const lineItems = [];
    if (invoice.make || invoice.model) {
      lineItems.push({
        label: `Véhicule : ${invoice.make || ''} ${invoice.model || ''}${invoice.license_plate ? ` (${invoice.license_plate})` : ''}`.trim(),
        amount: null,
      });
    }
    if (invoice.repair_description) {
      lineItems.push({ label: invoice.repair_description, amount: parseFloat(invoice.total_amount) });
    } else {
      lineItems.push({ label: "Prestation de service", amount: parseFloat(invoice.total_amount) });
    }

    lineItems.forEach((item, idx) => {
      const itemRowHeight = 32;
      if (idx % 2 === 1) {
        doc.rect(marginX, cursorY, contentWidth, itemRowHeight).fill("#fafafa");
      }
      doc
        .fillColor(darkColor)
        .font("Helvetica")
        .fontSize(10)
        .text(item.label, descColX + 12, cursorY + 10, { width: amountColX - descColX - 24 });
      if (item.amount !== null) {
        doc
          .font("Helvetica-Bold")
          .text(`$${item.amount.toFixed(2)}`, amountColX, cursorY + 10, { width: 108, align: "right" });
      }
      cursorY += itemRowHeight;
    });

    doc.moveTo(marginX, cursorY).lineTo(pageWidth - marginX, cursorY).lineWidth(1).strokeColor(borderColor).stroke();
    cursorY += 20;

    // ===== Total =====
    const totalBoxWidth = 220;
    const totalBoxX = pageWidth - marginX - totalBoxWidth;

    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor(grayColor)
      .text("Sous-total", totalBoxX, cursorY, { width: 110 });
    doc
      .font("Helvetica-Bold")
      .fillColor(darkColor)
      .text(`$${parseFloat(invoice.total_amount).toFixed(2)}`, totalBoxX + 110, cursorY, { width: 110, align: "right" });
    cursorY += 22;

    doc.rect(totalBoxX, cursorY, totalBoxWidth, 40).fill(primaryColor);
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("TOTAL À PAYER", totalBoxX + 15, cursorY + 12, { width: 110 });
    doc
      .fontSize(15)
      .text(`$${parseFloat(invoice.total_amount).toFixed(2)}`, totalBoxX, cursorY + 11, { width: totalBoxWidth - 15, align: "right" });

    cursorY += 70;

    // ===== Notes / conditions =====
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(grayColor)
      .text(
        "Merci de régler cette facture avant la date d'échéance indiquée. Pour toute question concernant cette facture, veuillez nous contacter.",
        marginX,
        cursorY,
        { width: contentWidth }
      );

    // ===== Pied de page =====
    const footerY = doc.page.height - 80;
    doc.moveTo(marginX, footerY).lineTo(pageWidth - marginX, footerY).lineWidth(1).strokeColor(borderColor).stroke();
    doc
      .fontSize(9)
      .fillColor(grayColor)
      .font("Helvetica")
      .text("Kwetu Garage - Votre garage de confiance", marginX, footerY + 12, { width: contentWidth, align: "center" })
      .text("contact@kwetugarage.com  |  +243 000 000 000", marginX, footerY + 26, { width: contentWidth, align: "center" });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la génération du PDF." });
  }
});

module.exports = router;
