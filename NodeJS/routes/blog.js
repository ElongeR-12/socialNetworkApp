const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
router.post('/post', blogCtrl.create);
router.get('/post', blogCtrl.getAllBlogs);
module.exports = router;