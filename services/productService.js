const ProductModel = require("../models/productModel");
const factory = require("./handlersFactory");
const { uuid } = require("uuidv4");
const sharp = require("sharp");
const expressAsyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middleWare/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = expressAsyncHandler(async (req, res, next) => {
  // Image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuid()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    //Save image into our db
    req.body.imageCover = imageCoverFileName;
  }

  // Image processing for Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuid()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        //Save image into our db
        req.body.images.push(imageName);
      })
    );
  }
  next();

});

// @desc    Get list of products
// @route   GET /api/products
// @access  Public
exports.getProducts = factory.getAll(ProductModel, "ProductModel");

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
