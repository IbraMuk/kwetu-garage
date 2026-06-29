# Déploiement de Kwetu Garage

Ce guide explique comment pousser le projet sur GitHub et déployer chaque partie.

---

## 1. GitHub

### Initialiser le repo (si ce n'est pas déjà fait)

```bash
cd "c:\Users\andwa\Documents\All my coorporation\Kwetu Garage"
git init
git add .
git commit -m "Initial commit: Kwetu Garage"
```

### Créer le repo sur GitHub

1. Allez sur https://github.com/new
2. Nommez le repo : `kwetu-garage`
3. Ne l'initialisez PAS avec README/.gitignore (ils existent déjà)
4. Copiez les commandes affichées, par exemple :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/kwetu-garage.git
git branch -M main
git push -u origin main
```

---

## 2. Backend sur Render

### Avant le déploiement

Assurez-vous d'avoir une base de données PostgreSQL en ligne :
- Option A : Render PostgreSQL (recommandé pour Render)
- Option B : Neon, Supabase, ou Railway

### Variables d'environnement Render

Dans le dashboard Render → votre service web → Environment :

```
DATABASE_URL=postgresql://user:password@host:5432/kwetu_garage
CORS_ORIGIN=https://votre-frontend-vercel.vercel.app
JWT_SECRET=votre_secret_jwt_long_et_aleatoire
JWT_EXPIRE=7d
PORT=10000
NODE_ENV=production
```

### Déploiement via render.yaml

1. Dans le dashboard Render, cliquez sur **New +** → **Blueprint** (ou **Deploy from Blueprint**)
2. Connectez votre repo GitHub
3. Render détectera automatiquement `render.yaml`
4. Créez une base PostgreSQL Render et liez-la au service

### Créer l'admin par défaut après déploiement

```bash
# Ouvrez le shell Render (ou exécutez en local connecté à la base distante)
node scripts/create-default-user.js
```

---

## 3. Frontend Web sur Vercel

### Variables d'environnement Vercel

Dans le dashboard Vercel → Project Settings → Environment Variables :

```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=https://votre-backend-render.onrender.com
```

### Déploiement

1. Allez sur https://vercel.com/new
2. Importez le repo GitHub
3. Sélectionnez le dossier `frontend-web`
4. Vercel détectera Next.js automatiquement
5. Ajoutez les variables d'environnement ci-dessus
6. Cliquez sur **Deploy**

---

## 4. Application Mobile en production

### Pré-requis

1. Créez un compte Expo : https://expo.dev/signup
2. Connectez-vous en CLI :

```bash
cd mobile
npx expo login
```

3. Vérifiez le projet Expo :

```bash
npx eas project:sync
```

### Configurer l'API de production

Créez `mobile/.env` avec l'URL de votre backend Render :

```env
EXPO_PUBLIC_API_URL=https://votre-backend-render.onrender.com/api
```

### Build Android (APK)

```bash
cd mobile
npx eas build --profile preview --platform android
```

### Build iOS (nécessite un compte Apple Developer)

```bash
npx eas build --profile production --platform ios
```

### Build de production complète

```bash
npx eas build --profile production --platform all
```

Le build terminé, vous recevrez un lien pour télécharger l'APK ou soumettre sur Play Store / App Store.

---

## Récapitulatif des URLs

| Service | URL locale | URL production |
|---------|------------|----------------|
| Frontend | http://localhost:3000 | https://votre-frontend-vercel.vercel.app |
| Backend | http://localhost:3001 | https://votre-backend-render.onrender.com |
| Mobile API | http://localhost:3001/api | https://votre-backend-render.onrender.com/api |

---

## Commandes utiles

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend-web
npm install
npm run dev

# Mobile
cd mobile
npm install
npx expo start --clear
```
