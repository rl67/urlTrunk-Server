var express = require('express');
var router = express.Router();
var tagList = require('../controllers/tagList.controller');

// CREATE a new tag list item
router.post('/tagList', tagList.create);


// GET all tag lists
router.get('/tagList', tagList.findAll);

module.exports = router;