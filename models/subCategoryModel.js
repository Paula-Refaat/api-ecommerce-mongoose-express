const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trime: true,
      unique: [true, "SubCategory must be unique"],
      required: [true, "sub Category required"],
      minLength: [2, "To short subCategory name"],
      maxLength: [32, "To long subCategory name"],
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategoryModel;
