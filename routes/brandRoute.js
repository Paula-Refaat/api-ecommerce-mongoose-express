const router = require("express").Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const authService = require("../services/authService");

router.get("/", getBrands);
router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrand
);
router.get("/:id", getBrandValidator, getBrand);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  updateBrand
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteBrandValidator,
  deleteBrand
);

module.exports = router;
