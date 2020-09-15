const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const multer = require('../middleware/multer-config')
router.post('/post', multer, blogCtrl.create);
router.get('/post', blogCtrl.getAllBlogs);
router.get('/:id', blogCtrl.getOneBlog);
router.get('/test/postAsso/:id', blogCtrl.testAsso);
// Retrieve all Blogs
router.get("/show/blogs", blogCtrl.findAll);
// Retrieve all published Blogs
router.get("/show/blogs/published", blogCtrl.findAllPublished);
module.exports = router;