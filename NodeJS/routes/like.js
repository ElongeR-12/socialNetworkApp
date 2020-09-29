const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const authJwt = require('../middleware/verifyJwtToken');
router.post('/:id/vote', [authJwt.verifyToken], likeCtrl.votePost);
module.exports = router;