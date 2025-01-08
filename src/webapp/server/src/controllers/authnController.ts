// File: src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Operator } from '../models/operator';
import { generateToken } from '../utils/jwtUtils';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const operator = await Operator.findOne({ email });
    if (!operator) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, operator.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = generateToken(operator.id);

    // Respond with token
    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
};
