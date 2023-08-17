const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); //Logger + midleware
const {dbConnection} = require('./config/database');

dotenv.config({ path: "config.env" });

//Connect With database
dbConnection();

//express App
const app = express();

//Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
