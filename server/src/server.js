import { app } from './app.js';
import { loadEnv, envVariables } from './Configs/env.config.js';
import { connectDB } from './Configs/postgress.config.js';
import { connectWhatsApp } from './Configs/whatsapp.config.js';

const PORT = envVariables.PORT || 3000;

async function startServer() {
  await loadEnv();
  await connectDB();
  await connectWhatsApp();
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer();
