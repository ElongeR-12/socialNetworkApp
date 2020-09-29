const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const multer = require('../middleware/multer-config');
const authJwt = require('../middleware/verifyJwtToken');
router.post('/image', [authJwt.verifyToken], multer, blogCtrl.upload);
router.get('/image', [authJwt.verifyToken], blogCtrl.upload);
module.exports = router;