const CouponModel = require("../models/couponModel");
const factory = require("./handlersFactory");

// @desc    Get list of Coupons
// @route   GET /api/Coupons
// @access  Private/admin
exports.getCoupons = factory.getAll(CouponModel);

// @desc    Get Specific Coupon by id
// @route   GET /api/coupons/:id
// @access  Private/admin
exports.getCoupon = factory.getOne(CouponModel);

// @desc    Create Coupon
// @route   POST /api/coupons
// @access   Private/admin
exports.createCoupon = factory.createOne(CouponModel);

// @desc    Update Specific Coupon
// @route   PUT /api/coupons/:id
// @access   Private/admin
exports.updateCoupon = factory.updateOne(CouponModel);

// @desc    Delete Specific Coupon
// @route   Del /api/coupons/:id
// @access   Private/admin
exports.deleteCoupon = factory.deleteOne(CouponModel);
