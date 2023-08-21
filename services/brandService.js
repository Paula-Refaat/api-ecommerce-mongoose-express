const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const BrandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  /*
page    limit     skip
1       10        0
2       10        10
3       10        20  
*/
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find({}).limit(limit).skip(skip);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc    Get Specific brand by id
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Create brand
// @route   POST /api/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res) => {
  const name = req.body.name;
  console.log(req.body);

  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @desc    Update Specific brand
// @route   PUT /api/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc    Delete Specific brand
// @route   Del /api/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id: ${id}`, 404));
  }

  res.status(204).send();
});
