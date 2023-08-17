const router = require('express').Router();

const { getCategories, createCategory } = require('../services/categoryService');

// you can abbreviate the twi lines of code with one step
//router.route('/').get(getCategories).post(createCategory);

router.get('/', getCategories);
router.post('/', createCategory); 


module.exports = router;