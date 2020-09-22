const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const authJwt = require('../middleware/verifyJwtToken');
const multer = require('../middleware/multer-config');
router.post('/post', [authJwt.verifyToken], multer, blogCtrl.create);
router.get('/post', [authJwt.verifyToken], blogCtrl.getAllBlogs);
router.get('/:id', [authJwt.verifyToken], blogCtrl.getOneBlog);
router.get('/test/postAsso/:id', [authJwt.verifyToken], blogCtrl.testAsso);
// Retrieve all Blogs
router.get("/show/blogs", [authJwt.verifyToken], blogCtrl.findAll);
router.delete('/delete/:id', [authJwt.verifyToken], blogCtrl.deleteBlog)
module.exports = router;