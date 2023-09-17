const { uuid } = require("uuidv4");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleWare/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

// Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// Image Procesing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`uploads/brands/${filename}`);

  //Save image into our db
  req.body.image = filename;

  next();
});

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
