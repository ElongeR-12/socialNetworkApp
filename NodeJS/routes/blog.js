const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const authJwt = require('../middleware/verifyJwtToken');
const multer = require('../middleware/multer-config');
router.post('/post', [authJwt.verifyToken], multer, blogCtrl.createPost);
router.get('/:id', [authJwt.verifyToken], blogCtrl.getOneBlog);
router.get('/postAssociation/:id', [authJwt.verifyToken], blogCtrl.getAssociationWithLikers);
router.get("/show/posts", [authJwt.verifyToken], blogCtrl.retrieveAllBlogsPerPage);
router.delete('/delete/:id', [authJwt.verifyToken], blogCtrl.deleteBlog)
module.exports = router;