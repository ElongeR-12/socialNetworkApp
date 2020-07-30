const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
router.post('/post', likeCtrl.pushLike);
module.exports = router;