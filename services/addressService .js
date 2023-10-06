const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// @desc    Add address to user addresses list
// @route   POST /api/addresses
// @access  Protected/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addtoSet => Add address object to user addresses list
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "address added successfully.",
    data: user.addresses,
  });
});

// @desc    remove address from user addresses list
// @route   DELTET /api/addresses/:addressId
// @access  Protected/user
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  // $addtoSet => remove address from user addresses list
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "address removed successfully.",
    data: user.addresses,
  });
});

// @desc    get logged user address
// @route   GET /api/addresses
// @access  Protected/user
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate({
    path: "addresses",
  });
  res.status(200).json({
    status: "Success",
    data: user.addresses,
  });
});

// @desc    update logged user address
// @route   GET /api/addresses/:addressId
// @access  Protected/user
exports.updateLoggedUserAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  const addressIndex = user.addresses.findIndex(
    (address) => address._id == req.params.addressId
  );
  user.addresses[addressIndex] = req.body;
  await user.save();
  res.status(200).json({
    status: "Success",
    data: user.addresses,
  });
});
