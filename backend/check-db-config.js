const fs = require('fs');
const path = require('path');

console.log('=== Vérification de la configuration PostgreSQL ===\n');

// Vérifier si .env existe
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env introuvable');
  console.log('\nCréez un fichier .env avec le contenu suivant :');
  console.log(`
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kwetu_garage
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_pgadmin
DATABASE_URL=postgresql://postgres:votre_mot_de_passe_pgadmin@localhost:5432/kwetu_garage

PORT=3001
NODE_ENV=development

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
  `);
  process.exit(1);
}

// Lire le fichier .env
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('Configuration actuelle dans .env :');
console.log('DB_HOST:', envVars.DB_HOST || 'non défini');
console.log('DB_PORT:', envVars.DB_PORT || 'non défini');
console.log('DB_NAME:', envVars.DB_NAME || 'non défini');
console.log('DB_USER:', envVars.DB_USER || 'non défini');
console.log('DB_PASSWORD:', envVars.DB_PASSWORD ? '*** défini ***' : '❌ non défini');
console.log('DATABASE_URL:', envVars.DATABASE_URL ? '*** défini ***' : '❌ non défini');

console.log('\n=== Instructions pour corriger ===');
console.log('1. Ouvrez pgAdmin et vérifiez:');
console.log('   - Nom de l utilisateur: généralement "postgres"');
console.log('   - Mot de passe: celui que vous utilisez dans pgAdmin');
console.log('   - Nom de la base: généralement "kwetu_garage"');

console.log('\n2. Modifiez backend/.env avec les bonnes valeurs:');
console.log('   - Remplacez DB_PASSWORD par votre vrai mot de passe PostgreSQL');
console.log('   - Assurez-vous que DATABASE_URL contient les mêmes identifiants');

console.log('\n3. Redémarrez le serveur backend avec: npm run dev');

// Test de connexion basique
const { Client } = require('pg');

if (envVars.DATABASE_URL) {
  const client = new Client({
    connectionString: envVars.DATABASE_URL
  });

  client.connect()
    .then(() => {
      console.log('\n✅ Connexion PostgreSQL réussie !');
      client.end();
    })
    .catch(err => {
      console.log('\n❌ Test de connexion échoué:', err.message);
      console.log('   Vérifiez les identifiants dans .env');
    });
}
