const router = require("express").Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

// you can abbreviate the twi lines of code with one step
//router.route('/').get(getCategories).post(createCategory);

router.get("/", getCategories);
router.post("/", createCategoryValidator, createCategory);
router.get("/:id", getCategoryValidator, getCategory);
router.put("/:id", updateCategoryValidator, updateCategory);
router.delete("/:id", deleteCategoryValidator, deleteCategory);

module.exports = router;
