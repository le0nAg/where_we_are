const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require("./routes/authnRoute");
const appRoute = require("./routes/appRoutes");

dotenv.config();

const env = process.env.NODE_ENV || 'dev';

dotenv.config({
  path: path.resolve(__dirname, `.env.${env}`),
});

// Configurazione di Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('Serving static files from:', path.join(__dirname, '../uploads'));

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