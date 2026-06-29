const fs = require('fs');
const path = require('path');

console.log('=== Correction automatique de .env ===\n');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

// Générer DATABASE_URL manquant
if (!envVars.DATABASE_URL && envVars.DB_USER && envVars.DB_PASSWORD) {
  const databaseUrl = `postgresql://${envVars.DB_USER}:${envVars.DB_PASSWORD}@${envVars.DB_HOST || 'localhost'}:${envVars.DB_PORT || '5432'}/${envVars.DB_NAME || 'kwetu_garage'}`;
  
  console.log('DATABASE_URL manquant détecté');
  console.log('Génération automatique...');
  console.log(`DATABASE_URL: ${databaseUrl}`);
  
  // Ajouter DATABASE_URL au fichier
  const updatedContent = envContent + `\nDATABASE_URL=${databaseUrl}\n`;
  fs.writeFileSync(envPath, updatedContent);
  
  console.log('\n✅ DATABASE_URL ajouté à .env');
  console.log('\n⚠️  Vérifiez que le mot de passe est correct:');
  console.log('   - Ouvrez pgAdmin');
  console.log('   - Connectez-vous avec les mêmes identifiants');
  console.log('   - Si ça échoue, modifiez DB_PASSWORD dans .env');
  
  console.log('\n📋 Étapes suivantes:');
  console.log('   1. Arrêtez le serveur backend (Ctrl+C)');
  console.log('   2. Relancez avec: npm run dev');
} else if (envVars.DATABASE_URL) {
  console.log('✅ DATABASE_URL déjà présent');
  console.log('Le problème vient probablement du mot de passe incorrect');
  console.log('\n🔍 Vérifiez manuellement:');
  console.log('   1. Ouvrez pgAdmin');
  console.log('   2. Notez le mot de passe qui fonctionne');
  console.log('   3. Mettez à jour DB_PASSWORD dans .env');
  console.log('   4. Relancez le serveur');
} else {
  console.log('❌ Variables manquantes dans .env');
}
