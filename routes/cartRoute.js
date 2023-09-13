const router = require("express").Router();
const authService = require("../services/authService");
const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartQuantity,
  applyCoupon,
} = require("../services/cartServics");
router.post(
  "/",
  authService.protect,
  authService.allowTo("user"),
  addProductToCart
);

router.get(
  "/",
  authService.protect,
  authService.allowTo("user"),
  getLoggedUserCart
);

router.delete(
  "/:itemId",
  authService.protect,
  authService.allowTo("user"),
  removeSpecificCartItem
);

router.put(
  "/applyCoupon",
  authService.protect,
  authService.allowTo("user"),
  applyCoupon
);

router.delete("/", authService.protect, authService.allowTo("user"), clearCart);

router.put(
  "/:itemId",
  authService.protect,
  authService.allowTo("user"),
  updateCartQuantity
);

module.exports = router;
