const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const subCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of subCategory
// @route   POST /api/subCategory
// @access  Private
exports.createSubCategory = asyncHandler(async(req, res) => {
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    category, 
  });
  res.status(201).json({
    data: subCategory,
  });
});

