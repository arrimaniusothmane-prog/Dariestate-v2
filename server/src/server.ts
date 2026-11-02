import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[DAR & ATELIER Server] API REST en cours d'exécution sur le port ${config.port}`);
  console.log(`[DAR & ATELIER Server] Documentation & Santé : http://localhost:${config.port}/api/v1/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux du serveur...');
  server.close(() => {
    process.exit(0);
  });
});
