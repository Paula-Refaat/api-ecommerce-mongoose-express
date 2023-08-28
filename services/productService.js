const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");

// @desc    Get list of products
// @route   GET /api/products
// @access  Public
exports.getProducts = factory.getAll(ProductModel,"ProductModel");

// @desc    Get Specific product by id
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = factory.getOne(ProductModel);

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = factory.createOne(ProductModel);

// @desc    Update Specific product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(ProductModel);

// @desc    Delete Specific product
// @route   Del /api/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(ProductModel);
