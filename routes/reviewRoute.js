const router = require("express").Router({ mergeParams: true });

const authService = require("../services/authService");
const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setUserIdToBody,
  createFilterObj,
  setProductIdToBody,
} = require("../services/reviewService");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

router.get("/", createFilterObj, getReviews);
router.post(
  "/",
  authService.protect,
  authService.allowTo("user"),
  setUserIdToBody,
  setProductIdToBody,
  createReviewValidator,
  createReview
);
router.get("/:id", getReviewValidator, getReview);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("user"),
  updateReviewValidator,
  updateReview
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("user", "admin"),
  deleteReviewValidator,
  deleteReview
);

module.exports = router;
