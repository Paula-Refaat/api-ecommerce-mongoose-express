const mongoose = require("mongoose");

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const URL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = URL;
  }
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2- Create Model
module.exports = mongoose.model("Brand", brandSchema);
