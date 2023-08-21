const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategoryModel = require("../models/subCategoryModel");

const ApiError = require("../utils/apiError");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc    Create subCategory
// @route   POST /api/subcategory
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({
    data: subCategory,
  });
});

//@desc   Get Specific subCategory
//@route  Get /api/subcategory/:id
//@access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) {
    next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(200).json({
    data: subCategory,
  });
});

// Nested route
// GET  /api/categories/:categoryId/subcategories

//@desc   Get list of subCategories
//@route  Get api/subcategories
//@access  Public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  const subCategories = await SubCategoryModel.find(filterObject)
    .limit(limit)
    .skip(skip)
    .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

//@desc   Update Specific subCategories
//@route  PUT api/subcategories/:id
//@access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

//@desc   Delete Specific subCategories
//@route  Delete api/subcategories/:id
//@access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findOneAndDelete(id);
  if (!subCategory) {
    next(new ApiError(`No subCategory for this id: ${id}`, 404));
  }
  res.status(204).send();
});
