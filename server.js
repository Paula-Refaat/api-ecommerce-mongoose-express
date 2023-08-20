const express = require("express");
const dotenv = require("dotenv");

const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const middleWare = require("./middleWare/middleWare");
const globalError = require("./middleWare/errorMiddleware");
const ApiError = require("./utils/apiError");

dotenv.config({ path: "config.env" });

//Connect With database
dbConnection();

//express App
const app = express();

//Middleware
middleWare();
app.use(express.json());

// Mount Routes
app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subCategoryRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handel rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down.... ");
    process.exit(1);
  });
});
