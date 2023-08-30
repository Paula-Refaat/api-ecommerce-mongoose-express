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
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const subcategoriesRoute = require("./subCategoryRoute");

// you can abbreviate the twi lines of code with one step
//router.route('/').get(getCategories).post(createCategory);

router.use("/:categoryId/subcategories", subcategoriesRoute);

router.get("/", getCategories);
router.post(
  "/",
  uploadCategoryImage,
  resizeImage,
  createCategoryValidator,
  createCategory
);
router.get("/:id", getCategoryValidator, getCategory);
router.put(
  "/:id",
  uploadCategoryImage,
  resizeImage,
  updateCategoryValidator,
  updateCategory
);
router.delete("/:id", deleteCategoryValidator, deleteCategory);

module.exports = router;
