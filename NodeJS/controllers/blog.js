const db = require('../config/db.config');
const config = require('../config/config');
const Blog = db.blog;
const User = db.user;
const Like = db.like;
exports.create = (req, res) => {
    console.log(req.file);
    const blogObject = req.body;
    Blog.create(
            // req.file ?
            // {
            {
                userId: req.body.userId,
                ...blogObject,
                likes: 0,
                postType: req.body.postType
            }
            //   postType: "IMAGE",
            //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            // } : 
            // {
            //   ...blogObject,
            //   postType: "TEXT"
            // }
        )
        .then(post => {
            res.send(post);
        })
        .catch(err => {
            res.status(500).send({ reason: err.message });
        })
}
exports.upload = (req, res) => {
    res.send({
        filename: req.file.filename
    })
}

exports.getAllBlogs = (req, res) => {
    Blog.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        include: [{
          model: User
        }]
    }).then(
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

exports.getOneBlog = (req, res) => {
    Blog.findOne({
      where: {
        id: req.params.id
      }
    }).then(
      (blog) => {
        res.status(200).json(blog);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  }

  