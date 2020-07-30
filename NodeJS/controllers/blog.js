const db = require('../config/db.config');
const config = require('../config/config');
const Blog = db.blog;
exports.create = (req, res) => {
    Blog.create({
            userId: req.body.userId,
            title: req.body.title,
            content: req.body.content
        })
        .then(post => {
            res.json(post);
        });
}