import app from './app';
import { config } from './config';

const PORT = config.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] SnailPay backend running in ${config.nodeEnv} mode on http://localhost:${PORT}`);
  });
}

export default app;

