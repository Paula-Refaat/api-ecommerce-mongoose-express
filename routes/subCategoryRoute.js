const { createSubCategory } = require("../services/subCategoryService");
const { createSubCategoryValidator } = require("../utils/validators/subCategoryValidator");

const router = require("express").Router();

router.post("/", createSubCategoryValidator,createSubCategory);

module.exports = router;