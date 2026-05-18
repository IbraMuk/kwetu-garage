# Documentation de l'API - E-Garage

Cette documentation décrit les endpoints de l'API REST pour l'application E-Garage.

## Base URL

```
http://localhost:3000/api
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer <votre_token>
```

### Inscription

```http
POST /auth/register
```

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "mechanic" // optionnel
}
```

**Réponse :**
```json
{
  "message": "Utilisateur créé avec succès.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "mechanic"
  },
  "token": "jwt_token"
}
```

### Connexion

```http
POST /auth/login
```

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "message": "Connexion réussie.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "mechanic"
  },
  "token": "jwt_token"
}
```

### Profil Utilisateur

```http
GET /auth/profile
```

**Réponse :**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "mechanic"
  }
}
```

## Clients

### Lister tous les clients

```http
GET /clients?search=<terme>
```

**Paramètres de requête :**
- `search` (optionnel) : Terme de recherche

**Réponse :**
```json
[
  {
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "0612345678",
    "address": "123 rue de la Paix",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Créer un client

```http
POST /clients
```

**Corps de la requête :**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "0612345678",
  "address": "123 rue de la Paix"
}
```

### Obtenir un client

```http
GET /clients/:id
```

### Mettre à jour un client

```http
PUT /clients/:id
```

### Supprimer un client

```http
DELETE /clients/:id
```

## Véhicules

### Lister tous les véhicules

```http
GET /vehicles?search=<terme>
```

**Réponse :**
```json
[
  {
    "id": "uuid",
    "client_id": "uuid",
    "make": "Peugeot",
    "model": "208",
    "year": 2020,
    "license_plate": "AB-123-CD",
    "vin": "VF7ABC12345678901",
    "mileage": 45000,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Créer un véhicule

```http
POST /vehicles
```

**Corps de la requête :**
```json
{
  "client_id": "uuid",
  "make": "Peugeot",
  "model": "208",
  "year": 2020,
  "license_plate": "AB-123-CD",
  "vin": "VF7ABC12345678901",
  "mileage": 45000
}
```

## Réparations

### Lister toutes les réparations

```http
GET /repairs?status=<statut>&mechanic_id=<id>&vehicle_id=<id>&client_id=<id>
```

**Paramètres de requête :**
- `status` : pending, in_progress, completed, cancelled
- `mechanic_id` : ID du mécanicien
- `vehicle_id` : ID du véhicule
- `client_id` : ID du client

### Créer une réparation

```http
POST /repairs
```

**Corps de la requête :**
```json
{
  "vehicle_id": "uuid",
  "mechanic_id": "uuid",
  "description": "Changement des plaquettes de frein",
  "status": "pending",
  "start_date": "2024-01-01T09:00:00Z"
}
```

### Mettre à jour le statut

```http
PATCH /repairs/:id/status
```

**Corps de la requête :**
```json
{
  "status": "completed"
}
```

## Pièces

### Lister toutes les pièces

```http
GET /parts?search=<terme>&low_stock=<boolean>
```

### Créer une pièce

```http
POST /parts
```

**Corps de la requête :**
```json
{
  "name": "Plaquettes de frein avant",
  "reference": "PF-208-2020",
  "description": "Plaquettes de frein pour Peugeot 208",
  "price": 45.99,
  "stock_quantity": 20,
  "min_stock_level": 5
}
```

### Mettre à jour le stock

```http
PATCH /parts/:id/stock
```

**Corps de la requête :**
```json
{
  "quantity": 5
}
```

## Factures

### Lister toutes les factures

```http
GET /invoices?status=<statut>&client_id=<id>&date_from=<date>&date_to=<date>
```

### Créer une facture

```http
POST /invoices
```

**Corps de la requête :**
```json
{
  "client_id": "uuid",
  "repair_id": "uuid",
  "due_date": "2024-02-01T00:00:00Z",
  "total_amount": 150.00,
  "status": "pending"
}
```

### Mettre à jour le statut

```http
PATCH /invoices/:id/status
```

**Corps de la requête :**
```json
{
  "status": "paid"
}
```

## Erreurs

L'API retourne les codes d'erreur HTTP suivants :

- `400` : Bad Request - Données invalides
- `401` : Unauthorized - Non authentifié
- `403` : Forbidden - Permissions insuffisantes
- `404` : Not Found - Ressource non trouvée
- `500` : Internal Server Error - Erreur serveur

**Format d'erreur :**
```json
{
  "error": "Message d'erreur détaillé"
}
```
