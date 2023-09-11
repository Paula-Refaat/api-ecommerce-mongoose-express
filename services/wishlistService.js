const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Protected/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  // $addtoSet => add productId to wishlist array if productId not exists
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Product added successfully to your Wishlist.",
    data: user.wishlist,
  });
});

// @desc    remove product from wishlist
// @route   DELTET /api/wishlist/:productId
// @access  Protected/user
exports.deleteProductFromWishlist = asyncHandler(async (req, res, next) => {
  // $addtoSet => remove productId from wishlist array if productId exist
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Product removed successfully from your Wishlist.",
    data: user.wishlist,
  });
});

// @desc    get logged user wishlist
// @route   GET /api/wishlist
// @access  Protected/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate({
    path: "wishlist",
  });
  res.status(200).json({
    status: "Success",
    data: user.wishlist,
  });
});
