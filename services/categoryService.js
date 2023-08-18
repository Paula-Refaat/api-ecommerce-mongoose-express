const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

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

// @desc    Create category
// @route   POST /api/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  console.log(req.body);

  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
