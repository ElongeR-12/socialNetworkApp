const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog');
router.post('/post', blogCtrl.create);
module.exports = router;