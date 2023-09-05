const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterobj,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authService = require("../services/authService");

//mergParams: Allow us to access parameters on other routes
const router = require("express").Router({ mergeParams: true });

router.post(
  "/",
  authService.protect,
  authService.allowTo("admin"),
  setCategoryIdToBody,
  createSubCategoryValidator,
  createSubCategory
);
router.get("/", createFilterobj, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);
router.put(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  updateSubCategoryValidator,
  updateSubCategory
);
router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("admin"),
  deleteSubCategoryValidator,
  deleteSubCategory
);

module.exports = router;
