const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

// @desc    create user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // 2- Generate Token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login, Please login to get accsess to this route"
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) Check if user exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token no longer exist", 401)
    );
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changes after token created Error
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password , please login again .."
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ApiError("you are not allowed to access this route"));
    }
    next();
  });
