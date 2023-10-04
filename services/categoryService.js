const mongoose = require("mongoose");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const CategoryModel = require("../models/categoryModel");
const SubCategoryModel = require("../models/subCategoryModel");
const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleWare/uploadImageMiddleware");

// Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image Procesing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    //Save image into our db
    req.body.image = filename;
  }
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
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  
  let session = null;
  session = await mongoose.startSession();
  session.startTransaction();
  try {
    const category = await CategoryModel.findByIdAndDelete(
      req.params.id
    ).session(session);
    if (!category) {
      return next(
        new ApiError(`No category found for this id: ${req.params.id}`, 404)
      );
    }
    await SubCategoryModel.deleteMany({ category: category._id }).session(
      session
    );
    await ProductModel.deleteMany({ category: category._id }).session(session);

    await session.commitTransaction();
    session.endSession();
    res.status(204).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});
