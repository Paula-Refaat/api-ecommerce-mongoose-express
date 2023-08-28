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

//mergParams: Allow us to access parameters on other routes
const router = require("express").Router({mergeParams: true});

router.post("/",setCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router.get("/", createFilterobj, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategory);
router.put("/:id", updateSubCategoryValidator, updateSubCategory);
router.delete("/:id", deleteSubCategoryValidator, deleteSubCategory);



module.exports = router;
