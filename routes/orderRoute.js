const router = require("express").Router();

const authService = require("../services/authService");
const {
  createCashOrder,
  getOrders,
  findSpecificOrder,
  filterOrdersForLoggedUser,
  updateOrderToDeliver,
  updateOrderTopaid,
  checkoutSession,
} = require("../services/orderService");

router.get(
  "/checkout-session/:cartId",
  authService.protect,
  authService.allowTo("user"),
  checkoutSession
);

router.post(
  "/:cartId",
  authService.protect,
  authService.allowTo("user"),
  createCashOrder
);

router.get(
  "/",
  authService.protect,
  authService.allowTo("user", "admin"),
  filterOrdersForLoggedUser,
  getOrders
);

router.get(
  "/:id",
  authService.protect,
  authService.allowTo("user"),
  findSpecificOrder
);

router.put(
  "/:id/deliver",
  authService.protect,
  authService.allowTo("admin"),
  updateOrderToDeliver
);

router.put(
  "/:id/pay",
  authService.protect,
  authService.allowTo("admin"),
  updateOrderTopaid
);

module.exports = router;
