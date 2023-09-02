const { uuid } = require("uuidv4");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middleWare/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const factory = require("./handlersFactory");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { hashSync } = require("bcryptjs");

// Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image Procesing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuid()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/users/${filename}`);

    //Save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @desc    Get list of users
// @route   GET /api/users
// @access  Private
exports.getUsers = factory.getAll(UserModel);

// @desc    Get Specific user by id
// @route   GET /api/users/:id
// @access  Private
exports.getUser = factory.getOne(UserModel);

// @desc    Create user
// @route   POST /api/users
// @access  Private
exports.createUser = factory.createOne(UserModel);

// @desc    Update Specific user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`No user for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: hashSync(req.body.password),
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`No user for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: user });
});

// @desc    Delete Specific user
// @route   Del /api/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(UserModel);
