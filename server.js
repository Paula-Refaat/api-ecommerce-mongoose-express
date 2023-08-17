const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const middleWare = require('./middleWare/middleWare')

dotenv.config({ path: "config.env" });

//Connect With database
dbConnection();

//express App
const app = express();


//Middleware
middleWare();

// Mount Routes
app.use("/api/categories", categoryRoute)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
