const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const authJwt = require('../middleware/verifyJwtToken');
router.post('/:id/vote', [authJwt.verifyToken], likeCtrl.votePost);
router.get('/votes', [authJwt.verifyToken], likeCtrl.getAllVotes);
module.exports = router;