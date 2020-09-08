const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
router.post('/:id/vote', likeCtrl.votePost);
router.get('/votes', likeCtrl.getAllVotes);
module.exports = router;