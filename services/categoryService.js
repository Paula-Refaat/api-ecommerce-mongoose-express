const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

// @desc    Get list of category
// @route   GET /api/categories
// @access  Public
exports.getCategories = factory.getAll(CategoryModel);

// @desc    Get Specific category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc    Create category
// @route   POST /api/categories
// @access  Private
exports.createCategory = factory.createOne(CategoryModel);

// @desc    Update Specific category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc    Delete Specific category
// @route   Del /api/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);
