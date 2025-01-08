// File: src/utils/jwtUtils.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Use environment variables for production

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SECRET_KEY);
};
