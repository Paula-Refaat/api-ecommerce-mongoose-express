const { check } = require("express-validator");
const validatorMiddleware = require("../../middleWare/validatorMiddleware");
const { default: slugify } = require("slugify");

exports.createSubCategoryValidator = [
  check("name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id formate"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory ID required")
    .isMongoId()
    .withMessage("Invalid subCategory id formate"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory ID required")
    .isMongoId()
    .withMessage("Invalid category id format"),
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id formate"),
  check("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("SubCategory ID required")
    .isMongoId()
    .withMessage("Invalid subCategory id formate"),
  validatorMiddleware,
];
