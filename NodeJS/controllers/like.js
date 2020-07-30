const db = require('../config/db.config');
const config = require('../config/config');
const Like = db.like;
exports.pushLike = (req, res) => {
    Like.create({
      blogId: req.body.blogId,
      likeValue: req.body.likeValue,
      likeUsername: req.body.likeUsername,
      likeUserId: req.body.likeUserId
    })
      .then(like => {
        res.json(like);
      });
}