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
} = require("../services/productService");

router.get("/", getProducts);
router.post("/", createProductValidator, createProduct);
router.get("/:id", getProductValidator, getProduct);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);

module.exports = router;
