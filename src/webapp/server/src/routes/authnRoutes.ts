// File: src/routes/authRoutes.ts
import express from 'express';
import { login } from '../controllers/authnController';

const router = express.Router();

router.post('/login', login);

export default router;
