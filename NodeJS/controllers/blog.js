const db = require('../config/db.config');
const Blog = db.blog;
const User = db.user;
const Like = db.like;
const Op = db.Sequelize.Op;
const fs = require('fs');
const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: blogs } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, blogs, totalPages, currentPage };
};
exports.create = (req, res) => {
    console.log(req.file);
    const blogObject = req.body;
    Blog.create(
            {
                userId: req.body.userId,
                ...blogObject,
                likes: 0,
                postType: req.body.postType
            }
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
      },
      include: [{ 
        model: User,
        attributes: ['id', 'name']
      },
      { 
        model: User,
        as: 'likers',
        attributes: ['id', 'name']
      }
    ]
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
  exports.testAsso = (req, res) => {  
    Blog.findAll({ 
      include: [{ 
        model: User,
        attributes: ['id', 'name'],
        model: User,
        as: 'likers',
        attributes: ['id', 'name'],
        through: ['userId', 'blogId'],
        where: {
          id: req.params.id
        },
      }]
    }).then(projects => {
       res.send(projects);
    });

  }

  // Retrieve all Blogs from the database.
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  let condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const { limit, offset } = getPagination(page, size);

  Blog.findAndCountAll(
    { where: condition, limit, offset,
      order: [
        ['createdAt', 'DESC']
    ],
    include: [{ 
      model: User,
      attributes: ['id', 'name'],
    },
    { 
      model: User,
      as: 'likers',
      attributes: ['id', 'name']
    }
  ] }
    )
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.status(200).send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving blogs."
      });
    });
};

exports.deleteBlog = (req, res, next) => {
	Blog.findOne({
		where: {
			id: req.params.id
		}
  })
  .then((blog)=>{
    const filename = blog.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      blog.destroy()
      .then(()=>{
        return res.status(201).json({
          'message': `blog with id ${req.params.id} deleted successfully`
        });
      })
      .catch((err) => {
          res.status(500).json({
              'error': `error to delete blog with id ${req.params.id}`
          });
      });
    })
  })
	.catch((err) => {
    res.status(500).json({
        'error': `error to find blog with id ${req.params.id}`
    });
  });
};
