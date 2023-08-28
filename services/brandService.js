const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

// @desc    Get list of brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = factory.getAll(BrandModel);

// @desc    Get Specific brand by id
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = factory.getOne(BrandModel);

// @desc    Create brand
// @route   POST /api/brands
// @access  Private
exports.createBrand = factory.createOne(BrandModel);

// @desc    Update Specific brand
// @route   PUT /api/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc    Delete Specific brand
// @route   Del /api/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(BrandModel);
