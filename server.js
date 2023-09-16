const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan"); //Logger + midleware
const path = require("path");
const compression = require("compression");

const dbConnection = require("./config/database");
const globalError = require("./middleWare/errorMiddleware");
const ApiError = require("./utils/apiError");

const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const addressRoute = require("./routes/addressRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");

dotenv.config({ path: "config.env" });

//Connect With database
dbConnection();

//express App
const app = express();

//Enable other domains to access your application
app.use(cors());
app.options("*", cors()); // include before other routes

// compress all responses
app.use(compression());

//Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subCategoryRoute);
app.use("/api/brands", brandRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/wishlists", wishlistRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

//Not Found Route
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
