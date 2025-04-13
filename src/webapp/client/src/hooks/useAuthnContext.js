import { AuthnContext } from '../context/AuthnContext';
import { useContext } from 'react';

export const useAuthnContext = () => {
  const context = useContext(AuthnContext);
  if (!context) {
    throw new Error('useAuthnContext must be used within a AuthProvider');
  }
  return context;
}