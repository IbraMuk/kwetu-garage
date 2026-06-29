const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('Création du fichier .env avec CORS_ORIGIN...');
  const defaultEnv = `CORS_ORIGIN=http://localhost:3000,http://localhost:3002,http://localhost:3003,http://localhost:8080,http://localhost:8081,http://localhost:8082

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kwetu_garage
DB_USER=postgres
DB_PASSWORD=admin123
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/kwetu_garage

PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
`;
  fs.writeFileSync(envPath, defaultEnv);
  console.log('✅ .env créé avec CORS_ORIGIN incluant le port 3002');
  process.exit(0);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');
let corsLineIndex = -1;

lines.forEach((line, index) => {
  if (line.startsWith('CORS_ORIGIN=')) {
    corsLineIndex = index;
  }
});

const requiredOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
];

if (corsLineIndex === -1) {
  lines.push(`CORS_ORIGIN=${requiredOrigins.join(',')}`);
  console.log('✅ CORS_ORIGIN ajouté à .env');
} else {
  const existing = lines[corsLineIndex].replace('CORS_ORIGIN=', '');
  const origins = existing.split(',').map(o => o.trim()).filter(Boolean);
  
  let changed = false;
  requiredOrigins.forEach(origin => {
    if (!origins.includes(origin)) {
      origins.push(origin);
      changed = true;
    }
  });
  
  if (changed) {
    lines[corsLineIndex] = `CORS_ORIGIN=${origins.join(',')}`;
    console.log('✅ CORS_ORIGIN mis à jour avec les ports manquants');
  } else {
    console.log('ℹ️ Tous les ports sont déjà présents dans CORS_ORIGIN');
  }
}

fs.writeFileSync(envPath, lines.join('\n'));
console.log('\n📋 Redémarrez le serveur backend pour appliquer les changements :');
console.log('   Arrêtez avec Ctrl+C, puis relancez : npm run dev');
