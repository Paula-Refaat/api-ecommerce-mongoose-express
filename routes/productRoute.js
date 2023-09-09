const router = require("express").Router();
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProduct,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const authService = require("../services/authService");

const reviewRoute = require("./reviewRoute");
router.use("/:productId/reviews", reviewRoute);

router.get("/", getProducts);
router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  uploadProductImages,
  resizeProductImages,
  createProductValidator,
  createProduct
);
router.get("/:id", getProductValidator, getProduct);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  updateProductValidator,
  updateProduct
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
