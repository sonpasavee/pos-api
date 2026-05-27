import { createApp } from './app';
import dotenv from 'dotenv';

// โหลด Environment Variables
dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 POS API Server is running on http://localhost:${PORT}`);
  console.log(`🔌 Health check endpoint: http://localhost:${PORT}/health`);
});
