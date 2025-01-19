const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config({path: path.join(__dirname, "env/config.env")});
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authnRoute");
const appRoute = require("./routes/appRoutes");
const { ATLAS_URI, SERVER_PORT, CLIENT_PORT } = process.env;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      version: '1.0.0',
      description: 'API for user authentication and authorization',
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose
  .connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

app.use(
  cors({
    origin: [`http://localhost:${CLIENT_PORT}`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.use(authRoute);
app.use(appRoute);