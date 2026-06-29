const path = require("path");
const fs = require("fs");
const envPath = path.join(__dirname, "../backend/.env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}
const { Pool } = require(path.join(__dirname, "../backend/node_modules/pg"));

async function main() {
  const base = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
  };

  const admin = new Pool({ ...base, database: "postgres" });

  try {
    const { rows: dbs } = await admin.query(
      `SELECT datname FROM pg_database 
       WHERE datistemplate = false 
       ORDER BY datname`,
    );
    console.log("--- Bases PostgreSQL sur ce serveur ---");
    dbs.forEach((r) => console.log("  •", r.datname));

    const names = ["kwetu_garage", "e_garage", "kwetugrage"];
    const found = dbs.map((r) => r.datname).filter((n) =>
      names.some((w) => n.toLowerCase().includes("kwetu") || n === w),
    );
    console.log("\n--- Bases liées au projet ---");
    if (found.length) found.forEach((n) => console.log("  ✓", n));
    else console.log("  (aucune base kwetu_* trouvée)");

    const exists = dbs.some((r) => r.datname === "kwetu_garage");
    console.log("\nkwetu_garage existe :", exists ? "OUI" : "NON");

    if (exists) {
      const app = new Pool({ ...base, database: "kwetu_garage" });
      const { rows: tables } = await app.query(
        `SELECT table_name FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
         ORDER BY table_name`,
      );
      console.log("Tables dans kwetu_garage :", tables.length);
      if (tables.length) {
        tables.slice(0, 15).forEach((t) => console.log("  -", t.table_name));
        if (tables.length > 15) console.log("  ... et", tables.length - 15, "autres");
      }
      await app.end();
    }
  } catch (err) {
    console.error("ERREUR connexion PostgreSQL :", err.message);
    if (err.code === "28P01") {
      console.error("→ Mot de passe ou utilisateur incorrect dans backend/.env");
    }
    process.exit(1);
  } finally {
    await admin.end();
  }
}

main();
