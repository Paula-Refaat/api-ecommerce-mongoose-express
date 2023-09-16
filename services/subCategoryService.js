const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
exports.createFilterobj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Create subCategory
// @route   POST /api/subcategory
// @access  Private
exports.createSubCategory = factory.createOne(SubCategoryModel);

//@desc   Get Specific subCategory
//@route  Get /api/subcategory/:id
//@access Public
exports.getSubCategory = factory.getOne(SubCategoryModel);

//@desc   Get list of subCategories
//@route  Get api/subcategories
//@access  Public
exports.getSubCategories = factory.getAll(SubCategoryModel);

//@desc   Update Specific subCategories
//@route  PUT api/subcategories/:id
//@access  Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel);

//@desc   Delete Specific subCategories
//@route  Delete api/subcategories/:id
//@access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
