const { initDb } = require('./scripts/init-db');

async function start() {
  await initDb();
  require('./src/index');
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
