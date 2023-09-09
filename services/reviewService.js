const ReviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.setUserIdToBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = factory.getAll(ReviewModel);

// @desc    Get Specific review by id
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = factory.getOne(ReviewModel);

// @desc    Create review
// @route   POST /api/reviews
// @access  Private/Protect/User
exports.createReview = factory.createOne(ReviewModel);

// @desc    Update Specific review
// @route   PUT /api/reviews/:id
// @access  Private/protect/User
exports.updateReview = factory.updateOne(ReviewModel);

// @desc    Delete Specific review
// @route   Del /api/reviews/:id
// @access  Private/protect/User-admin
exports.deleteReview = factory.deleteOne(ReviewModel);
