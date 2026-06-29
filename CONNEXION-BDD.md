# Connexion Web + Mobile → PostgreSQL

Les applications **web** (Next.js) et **mobile** (Expo) passent par l’**API Express** (`backend/`), qui lit et écrit dans PostgreSQL (`kwetu_garage`).

```
┌─────────────┐     ┌─────────────┐
│  Web :3000  │     │ Mobile Expo │
│  /api →     │     │  :3001/api  │
└──────┬──────┘     └──────┬──────┘
       │    proxy          │ direct
       └────────┬──────────┘
                ▼
       ┌─────────────────┐
       │ Express :3001   │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │ PostgreSQL      │
       │ kwetu_garage    │
       └─────────────────┘
```

## 1. Base de données

```powershell
cd database
$env:PGPASSWORD = "VOTRE_MOT_DE_PASSE_POSTGRES"
.\install-kwetu-garage.ps1
```

## 2. Backend

```powershell
cd backend
copy .env.example .env
# Éditez .env : DB_PASSWORD (ou DATABASE_URL), JWT_SECRET
npm install
npm run dev
```

Vérifiez : [http://localhost:3001/api/health](http://localhost:3001/api/health) → `"database":"connected"`

## 3. Application web

```powershell
cd frontend-web
copy .env.example .env.local
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) — les appels `/api/*` sont proxifiés vers Express.

Connexion : `admin@kwetugarage.com` / `password123` (utilisateur dans `database/seed.sql`).

## 4. Application mobile

```powershell
cd mobile
copy .env.example .env
# Sur téléphone : EXPO_PUBLIC_API_URL=http://IP_DU_PC:3001/api
npx expo start --clear
```

Le mode **démo** reste disponible sans serveur ; la connexion réelle utilise PostgreSQL via l’API.

## Dépannage

| Problème | Solution |
|----------|----------|
| `28P01` PostgreSQL | Corriger `DB_PASSWORD` dans `backend/.env` |
| Web : erreur API | Backend démarré sur 3001 ? `.env.local` avec `BACKEND_URL` |
| Mobile : réseau | IP LAN dans `EXPO_PUBLIC_API_URL`, pas `localhost` |
| CORS | `CORS_ORIGIN=http://localhost:3000` dans `backend/.env` |

Les anciennes routes mock Next.js sont dans `frontend-web/mocks/disabled-next-api-mocks/` (désactivées).
