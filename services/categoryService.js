const { uuid } = require("uuidv4");
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleWare/uploadImageMiddleware");


// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image Procesing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `category-${uuid()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  //Save image into our db
  req.body.image = filename;

  next();
});

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
