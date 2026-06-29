const express = require('express');

const router = express.Router();

/**
 * Stub : le backend n’avait pas de route rendez-vous (404 côté front).
 * Retourne une liste vide jusqu’à branchement PostgreSQL + modèle Appointment.
 * Pour des données mockées sans Postgres, utilisez l’API Next.js (sans NEXT_PUBLIC_API_URL vers ce backend).
 */
router.get('/', (_req, res) => {
  res.json([]);
});

router.post('/', (_req, res) => {
  res.status(501).json({
    error:
      'Création de rendez-vous via le backend Express non implémentée. Utilisez l’API Next.js ou ajoutez un modèle Appointment.',
  });
});

module.exports = router;
