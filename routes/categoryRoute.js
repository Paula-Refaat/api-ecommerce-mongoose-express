const router = require('express').Router();

const { getCategories } = require('../services/categoryService');


router.get('/', getCategories); 

module.exports = router;