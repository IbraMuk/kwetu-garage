const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('=== Diagnostic mot de passe PostgreSQL ===\n');

// Read current .env password
const envPath = path.join(__dirname, '..', '.env');
let currentPassword = '';
let dbUser = 'postgres';
let dbName = 'kwetu_garage';
let dbPort = '5432';
let dbHost = 'localhost';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('DB_PASSWORD=')) currentPassword = line.split('=')[1].trim();
    if (line.startsWith('DB_USER=')) dbUser = line.split('=')[1].trim();
    if (line.startsWith('DB_NAME=')) dbName = line.split('=')[1].trim();
    if (line.startsWith('DB_PORT=')) dbPort = line.split('=')[1].trim();
    if (line.startsWith('DB_HOST=')) dbHost = line.split('=')[1].trim();
  });
  console.log('Configuration actuelle dans .env :');
  console.log(`  Host: ${dbHost}`);
  console.log(`  Port: ${dbPort}`);
  console.log(`  User: ${dbUser}`);
  console.log(`  Database: ${dbName}`);
  console.log(`  Password actuel: ${currentPassword ? '***' : 'non défini'}`);
} else {
  console.log('⚠️  Fichier .env non trouvé');
}

async function testPassword(password) {
  const client = new Client({
    host: dbHost,
    port: parseInt(dbPort),
    user: dbUser,
    password: password,
    database: dbName,
    connectionTimeoutMillis: 3000,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    return true;
  } catch (error) {
    await client.end().catch(() => {});
    return false;
  }
}

async function main() {
  console.log('\nTest du mot de passe actuel...');
  if (currentPassword) {
    const works = await testPassword(currentPassword);
    if (works) {
      console.log('✅ Le mot de passe actuel fonctionne !');
      console.log('\nSi le backend a encore une erreur, redémarrez-le avec Ctrl+C puis npm run dev');
      return;
    }
  }

  console.log('❌ Le mot de passe actuel ne fonctionne pas.\n');
  console.log('Test des mots de passe courants...');

  const commonPasswords = [
    'admin',
    'admin123',
    'password',
    'password123',
    'postgres',
    'postgres123',
    'root',
    'root123',
    '123456',
    'kwetu',
    'kwetu123',
    'garage',
    'garage123',
    '',
  ];

  let found = false;
  for (const password of commonPasswords) {
    process.stdout.write(`  Test: "${password || '(vide)'}" ... `);
    const works = await testPassword(password);
    if (works) {
      console.log('✅ FONCTIONNE !');
      console.log(`\n📝 Mot de passe correct trouvé : "${password}"`);
      console.log('\nMettez à jour backend/.env avec cette valeur :');
      console.log(`DB_PASSWORD=${password}`);
      console.log(`DATABASE_URL=postgresql://${dbUser}:${password}@${dbHost}:${dbPort}/${dbName}`);
      found = true;
      break;
    } else {
      console.log('non');
    }
  }

  if (!found) {
    console.log('\n❌ Aucun mot de passe courant ne fonctionne.');
    console.log('\n🔧 Solutions :');
    console.log('1. Ouvrez pgAdmin et connectez-vous avec l\'utilisateur postgres');
    console.log('2. Allez dans Properties > Definition pour voir le mot de passe');
    console.log('3. Ou réinitialisez le mot de passe postgres dans pgAdmin :');
    console.log('   - Clic droit sur l\'utilisateur postgres > Properties');
    console.log('   - Onglet Definition > entrez un nouveau mot de passe');
    console.log('   - Redémarrez PostgreSQL (Services Windows)');
    console.log('4. Mettez à jour backend/.env avec le nouveau mot de passe');
  }
}

main().catch(err => {
  console.error('Erreur:', err.message);
  process.exit(1);
});
