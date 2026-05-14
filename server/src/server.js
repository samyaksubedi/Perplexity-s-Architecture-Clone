import { app } from './app.js';
import { loadEnv, envVariables } from './Configs/env.config.js';

const PORT = envVariables.PORT || 3000;

async function startServer() {
  loadEnv();
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer();
