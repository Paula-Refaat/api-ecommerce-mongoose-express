const express = require("express");
const app = express();
const morgan = require("morgan"); //Logger + midleware

const middleWare = () => {

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
}
module.exports = middleWare;