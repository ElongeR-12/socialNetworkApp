const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const multer = require('../middleware/multer-config')
router.post('/post', multer, blogCtrl.create);
router.get('/post', blogCtrl.getAllBlogs);
module.exports = router;