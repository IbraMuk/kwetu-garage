const bcrypt = require('bcryptjs');
const { query } = require('../src/config/database');

async function createDefaultUser() {
  try {
    const email = 'admin@kwetugarage.com';
    const password = 'password123';
    const firstName = 'Admin';
    const lastName = 'Kwetu';
    const role = 'admin';

    // Vérifier si l'utilisateur existe déjà
    const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`L'utilisateur ${email} existe déjà.`);
      process.exit(0);
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    await query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, firstName, lastName, role]
    );

    console.log('✅ Utilisateur par défaut créé avec succès');
    console.log(`Email: ${email}`);
    console.log(`Mot de passe: ${password}`);
    console.log(`Rôle: ${role}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur:', error.message);
    process.exit(1);
  }
}

createDefaultUser();
