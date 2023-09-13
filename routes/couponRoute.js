const router = require("express").Router();

const authService = require("../services/authService");
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

router.get("/", authService.protect, authService.allowTo("admin"), getCoupons);
router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  createCoupon
);
router.get(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  getCoupon
);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  updateCoupon
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteCoupon
);

module.exports = router;
