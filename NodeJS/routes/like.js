const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
router.post('/postLike', likeCtrl.pushLike);
module.exports = router;