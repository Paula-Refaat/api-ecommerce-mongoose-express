const router = require("express").Router();
const authService = require("../services/authService");
const {
  addProductToWishlist,
  deleteProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

router.post(
  "/",
  authService.protect,
  authService.allowTo("user"),
  addProductToWishlist
);

router.get(
  "/",
  authService.protect,
  authService.allowTo("user"),
  getLoggedUserWishlist
);

router.delete(
  "/:productId",
  authService.protect,
  authService.allowTo("user"),
  deleteProductFromWishlist
);

module.exports = router;
