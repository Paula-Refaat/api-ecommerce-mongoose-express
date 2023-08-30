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

router.get("/", getBrands);
router.post(
  "/",
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrand
);
router.get("/:id", getBrandValidator, getBrand);
router.put(
  "/:id",
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  updateBrand
);
router.delete("/:id", deleteBrandValidator, deleteBrand);

module.exports = router;
