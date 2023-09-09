const { check } = require("express-validator");
const validatorMiddleware = require("../../middleWare/validatorMiddleware");
const ReviewModel = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings valuw required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("ratins value must be betwwen 1 to 5"),
  // check("user").isMongoId().withMessage("Invalid Review userId format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Review productId format")
    .custom((val, { req }) =>
      // check if logged user create review before
      ReviewModel.findOne({ user: req.user._id, product: val }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
        }
      )
    ),
  validatorMiddleware,
];
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`There is no review for this id ${val}`)
          );
        }
        if (review.user._id.toString() != req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform this action")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return ReviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review for this id ${val}`)
            );
          }
          if (review.user._id.toString() != req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform this action")
            );
          }
        });
      }
      return true;
    }),

  validatorMiddleware,
];
