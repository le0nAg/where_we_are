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

mongoose
  .connect(ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(SERVER_PORT,'0.0.0.0', () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

app.use(
  cors({
    origin: [`https://whereweare-production.up.railway.app/`],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.use(authRoute);
app.use(appRoute);

module.exports = app;