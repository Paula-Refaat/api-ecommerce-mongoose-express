const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const UserAuthorization = require("../utils/UserAuthorization");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

const userModel = require("../models/userModel");

// @desc    create user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    slug: req.body.slug
  });
  // 2- Generate Token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @desc    Get user
// @route   GET /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc  make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  const userAuthorization = new UserAuthorization();

  const token = userAuthorization.getToken(req.headers.authorization);
  const decoded = userAuthorization.tokenVerifcation(token);
  const currentUser = await userAuthorization.checkCurrentUserExist(decoded);
  userAuthorization.checkCurrentUserIsActive(currentUser);
  userAuthorization.checkUserChangeHisPasswordAfterTokenCreated(
    currentUser,
    decoded
  );

  req.user = currentUser;
  next();
});

//desc  Authorization (User Permissions)
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ApiError("you are not allowed to access this route", 403));
    }
    next();
  });

// @desc    Forgot password
// @route   GET /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1- Get user by email.
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(`No user for that email ${req.body.email}`, 404));
  }

  // 2- If user exist, Generate hash rest random 6 digits.
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed reset code into db.
  user.passwordResetCode = hashResetCode;
  //Add expiration time for password reset code (10 Min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name}, \n We received a request to reset the passwrd on your E-shop Account . \n ${resetCode} \n Enter this code to complete the reset.\n Thanks for helping us keep your account secure. \n  the E-shop Team`;

  // 3-Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: " Your Password Reset Code (Valid For 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email ", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code send to email" });
});

// @desc    verify Password Reset Code
// @route   GET /api/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code

  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await userModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 422));
  }
  //2) resetcode valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

// @desc     Reset Password
// @route   GET /api/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404)
    );
  }
  // Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  //3 ) if everything is okay,  generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
