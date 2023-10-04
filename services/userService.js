const { uuid } = require("uuidv4");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { hashSync } = require("bcryptjs");
const { uploadSingleImage } = require("../middleWare/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const UserAuthorization = require("../utils/UserAuthorization");
const createToken = require("../utils/createToken");
const userModel = require("../models/userModel");

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
// @access  Private/admin
exports.getUsers = factory.getAll(UserModel);

// @desc    Get Specific user by id
// @route   GET /api/users/:id
// @access  Private/admin
exports.getUser = factory.getOne(UserModel);

// @desc    Create user
// @route   POST /api/users
// @access  Private/admin
exports.createUser = factory.createOne(UserModel);

// @desc    Update Specific user
// @route   PUT /api/users/:id
// @access  Private/admin
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

// @desc    Change Specific user password
// @route   PUT /api/users/changePassword/:id
// @access  Private/admin
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: hashSync(req.body.password),
      passwordChangedAt: Date.now(),
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
// @access  Private/admin
exports.deleteUser = factory.deleteOne(UserModel);

// @desc    Get Logged user
// @route   get /api/users/getMe
// @access  Private/protected
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update Logged user password
// @route   put /api/users/updateMyPassword
// @access  Private/protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: hashSync(req.body.password),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  const token = createToken(user._id);
  res.status(200).json({ date: user, token });
});

// @desc    Update Logged user date (without password, role)
// @route   put /api/users/updateMe
// @access  Private/protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      slug: req.body.slug,
    },
    { new: true }
  );

  res.status(200).json({ date: updatedUser });
});

// @desc    Deactivate Logged user
// @route   DELETE /api/users/deActiveMe
// @access  Private/protected
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "success" });
});

// @desc    Activate Logged user
// @route   DELETE /api/users/activeMe
// @access  Private/protected
exports.activeLoggedUserData = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  const decoded = userAuthorization.tokenVerifcation(token);
  const currentUser = await userAuthorization.checkCurrentUserExist(decoded);
  if (currentUser.active) {
    return next(new ApiError("Your Account is already active", 400));
  }
  await userModel.findByIdAndUpdate(currentUser._id, { active: true });

  res.status(200).json({ data: "Your account has been activated" });
});
