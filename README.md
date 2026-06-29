# E-Garage - Application de Gestion de Garage

Une application complète pour la gestion de garage avec :
- Backend Node.js avec Express et PostgreSQL
- Frontend web Next.js
- Application mobile React Native

## Structure du Projet

```
E-Garage/
├── backend/          # API Node.js + Express
├── frontend-web/     # Application web Next.js
├── mobile/          # Application mobile React Native
└── docs/            # Documentation
```

## Installation

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend Web
```bash
cd frontend-web
npm install
npm run dev
```

### Application Mobile
```bash
cd mobile
npm install
npx expo start
```

## Base de Données

Assurez-vous d'avoir PostgreSQL installé et configuré. Créez une base de données `e_garage` avant de lancer l'application.

## Features

- Gestion des clients
- Gestion des véhicules
- Suivi des réparations
- Gestion des pièces détachées
- Facturation
- Tableau de bord analytique

## Déploiement

Voir le guide complet dans `DEPLOYMENT.md` pour déployer sur :
- GitHub
- Vercel (frontend web)
- Render (backend + base de données PostgreSQL)
- Stores mobiles via Expo EAS (Android / iOS)
