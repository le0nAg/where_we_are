import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import poiRoutes from './poi'; // Importa il file delle route

dotenv.config({
   path: __dirname+'/env/config.env',
   encoding: 'utf8'
  });

import mongoose from './config/db_connection';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript backend!');
});

// Route per i punti di interesse
app.use('/api/poi', poiRoutes); // Collegamento alle route

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

