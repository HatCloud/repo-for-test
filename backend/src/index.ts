import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/database';
import templatesRouter from './routes/templates';
import recordsRouter from './routes/records';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/templates', templatesRouter);
app.use('/api/records', recordsRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🏋️ Fitness Timer API running on port ${PORT}`);
  });
}

start().catch(console.error);
