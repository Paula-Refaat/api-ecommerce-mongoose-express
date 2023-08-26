const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");

// @desc    Get list of products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // 1) Filtering
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "limit", "sort", "fields","keyword"];
  excludesFields.forEach((field) => delete queryStringObj[field]);

  //apply filtering using [gte, gt, lte, ls]
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // 2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const skip = (page - 1) * limit;

  //Build query
  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))
    .limit(limit)
    .skip(skip);

  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4) Fields Limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery
      .populate({ path: "category", select: "name -_id" })
      .select("-__v");
  }
  //5) Search
  if(req.query.keyword){
    const query = {};
    query.$or = [
      {title: {$regex: req.query.keyword, $options: "i"}},
      {description: {$regex: req.query.keyword, $options: "i"}}
    ]
    mongooseQuery = mongooseQuery.find(query);
  }

  // Execute query
  const products = await mongooseQuery;
  res.status(200).json({ results: products.length, page, data: products });
});

// @desc    Get Specific product by id
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  //validate for category
  //  const category =  CategoryModel.findById(req.body.category)

  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});

// @desc    Update Specific product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc    Delete Specific product
// @route   Del /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product for this id: ${id}`, 404));
  }

  res.status(204).send();
});
