const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of category
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  /*
page    limit     skip
1       10        0
2       10        10
3       10        20  
*/
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find({}).limit(limit).skip(skip);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc    Get Specific category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  console.log(req.body);

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @desc    Update Specific category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete Specific category
// @route   Del /api/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category for this id: ${id}`, 404));
  }

  res.status(204).send();
});
