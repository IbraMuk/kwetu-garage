# Guide d'Installation - E-Garage

Ce guide vous aidera à installer et configurer l'application E-Garage sur votre machine.

## Prérequis

- Node.js (version 16 ou supérieure)
- PostgreSQL (version 12 ou supérieure)
- npm ou yarn
- Git

## Structure du Projet

```
E-Garage/
├── backend/          # API Node.js + Express
├── frontend-web/     # Application web Next.js
├── mobile/          # Application mobile React Native
└── docs/            # Documentation
```

## Installation du Backend

1. Naviguez vers le dossier backend :
   ```bash
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez la base de données PostgreSQL :
   - Créez une base de données nommée `e_garage`
   - Exécutez le fichier `src/models/init.sql` pour créer les tables

4. Créez le fichier `.env` :
   ```bash
   cp .env.example .env
   ```

5. Modifiez le fichier `.env` avec vos informations de base de données :
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=e_garage
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   ```

6. Démarrez le serveur :
   ```bash
   npm run dev
   ```

L'API sera disponible sur `http://localhost:3000`

## Installation du Frontend Web

1. Naviguez vers le dossier frontend-web :
   ```bash
   cd frontend-web
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application :
   ```bash
   npm run dev
   ```

L'application web sera disponible sur `http://localhost:3001`

## Installation de l'Application Mobile

### Prérequis additionnels

- Expo CLI : `npm install -g expo-cli`
- Expo Go sur votre appareil mobile (optionnel)

### Installation

1. Naviguez vers le dossier mobile :
   ```bash
   cd mobile
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez l'application :
   ```bash
   npm start
   ```

4. Scannez le code QR avec l'application Expo Go sur votre mobile

## Configuration Initiale

1. Créez un compte administrateur via l'API :
   ```bash
   POST http://localhost:3000/api/auth/register
   {
     "email": "admin@egarage.com",
     "password": "votre_mot_de_passe",
     "first_name": "Admin",
     "last_name": "User",
     "role": "admin"
   }
   ```

2. Connectez-vous avec ces identifiants sur l'application web

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifiez que PostgreSQL est en cours d'exécution
   - Vérifiez les identifiants dans le fichier `.env`
   - Assurez-vous que la base de données `e_garage` existe

2. **Port déjà utilisé**
   - Modifiez le port dans le fichier `.env` du backend
   - Assurez-vous de mettre à jour l'URL dans le frontend

3. **Problèmes avec les dépendances**
   - Supprimez `node_modules` et `package-lock.json`
   - Réinstallez avec `npm install`

### Support

Pour toute question ou problème, veuillez créer une issue sur le dépôt GitHub du projet.
