const router = require("express").Router();

const {
  getCategories,
  createCategory,
  getCategory,
} = require("../services/categoryService");

// you can abbreviate the twi lines of code with one step
//router.route('/').get(getCategories).post(createCategory);

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:id", getCategory);

module.exports = router;
