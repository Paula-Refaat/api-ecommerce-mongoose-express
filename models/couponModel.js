const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trime: true,
      required: [true, "Coupon name required"],
      unique: true,
    },
    expire: {
      type: Date,
      reuired: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      reuired: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
