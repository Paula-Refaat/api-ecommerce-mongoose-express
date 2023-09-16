const CartModel = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const CouponModel = require("../models/couponModel");

const ApiError = require("../utils/apiError");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;

  return totalPrice;
};

// @desc    Add Product to cart
// @route   POST /api/carts
// @access  Private/user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);

  // 1) Get Cart for logged user
  let cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // 1- if product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // 2-if product dosn't exist push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc    Get logged user cart
// @route   GET /api/carts
// @access  Private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne(req.user_id);
  if (!cart) {
    return next(
      new ApiError(`No cart for this user id : ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Removed specific cart item
// @route   DELETE /api/carts/:itemId
// @access  Private/user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Clear logged user cart
// @route   DELETE /api/carts/
// @access  Private/user
exports.clearCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update Specific cart item quantity
// @route   DELETE /api/carts/:itemId
// @access  Private/user
exports.updateCartQuantity = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`No cart for this user id : ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = req.body.quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`No item for this id : ${req.params.itemId}`, 404)
    );
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply Coupon on logged user cart
// @route   DELETE /api/carts/applyCoupon
// @access  Private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) get coupon based on coupon name
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  console.log(coupon);
  if (!coupon) {
    return next(new ApiError("Invalid Coupon or Expired", 404));
  }
  // 2) get cart, to apply coupon
  const cart = await CartModel.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  cart.save();

  res.status(200).json({
    status: "Success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
