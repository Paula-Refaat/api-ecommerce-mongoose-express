const { check } = require("express-validator");
const validatorMiddleware = require("../../middleWare/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("To short subCategory name")
    .isLength({ max: 32 })
    .withMessage("to long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id formate"),
  validatorMiddleware,
];
