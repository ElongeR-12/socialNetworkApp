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
        })
        .catch(err => {
          res.status(500).send({ reason: err.message });
        })
}

exports.getAllBlogs = (req, res) => {
  Blog.findAll().then(
    (blogs) => {
      res.status(200).json(blogs);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
}