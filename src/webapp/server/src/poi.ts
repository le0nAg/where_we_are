import express, { Request, Response } from 'express';

const router = express.Router();

// Endpoint per aggiungere un punto di interesse
router.post('/', (req: Request, res: Response) => {
  const { nome, lat, lng } = req.body;

  if (!nome || !lat || !lng) {
    res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }
  else{
        // Simula il salvataggio dei dati
        console.log('Punto di interesse ricevuto:', { nome, lat, lng });

        res.status(201).json({ message: 'Punto di interesse salvato con successo!' });
    }
});

export default router;
