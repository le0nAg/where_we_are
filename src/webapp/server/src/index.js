const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require("./routes/authnRoute");
const appRoute = require("./routes/appRoutes");

// Carica le variabili d'ambiente
dotenv.config();

// Determine the environment
const env = process.env.NODE_ENV || 'dev';

// Load the correct .env file
dotenv.config({
  path: path.resolve(__dirname, `.env.${env}`),
});

console.log(`Running in ${env} mode`);

// Configurazione di Express
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Connessione al database
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  //useUnifiedTopology: true,
})
.then(() => console.log('Connesso al database'))
.catch((err) => console.error('Errore di connessione al database:', err));

// Route di esempio
app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.use(authRoute);
app.use(appRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});

module.exports = app;