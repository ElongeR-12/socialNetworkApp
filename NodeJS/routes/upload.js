const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
const multer = require('../middleware/multer-config');
router.post('/image', multer, blogCtrl.upload);
router.get('/image', blogCtrl.upload);
router.post('/video', multer, blogCtrl.upload);
module.exports = router;