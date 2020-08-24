const db = require('../config/db.config');
const Blog = db.blog;
const Like = db.like;
const User = db.user;
// Constants
const DISLIKED = 0;
const LIKED = 1;

exports.likePost = (req, res) => {

  const userId = 2;
  // Params
  const blogId = 1;

  if (blogId <= 0) {
    return res.status(400).json({
      'error': 'invalid parameters'
    });
  }

  console.log(blogId);
  Blog.findOne({
      where: {
        id: blogId
      }
    })
    .then(blogFound => {
      console.log(blogFound);
      if (blogFound) {
        User.findOne({
            where: {
              id: userId
            }
          })
          .then(userFound => {
            if (userFound) {
              Like.findOne({
                  where: {
                    userId: userId,
                    blogId: blogId
                  }
                })
                .then(userAlreadyLikedFound => {
                  if (!userAlreadyLikedFound) {
                    blogFound.setUser(userFound)
                      .then(() => {
                        Like.create({
                          userId: userId,
                          blogId: blogId,
                          isLike: LIKED
                        })
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          'error': 'error to create like'
                        });
                      })
                      .then(alreadyLikeFound => {
                        blogFound.update({
                          likes: blogFound.likes + 1
                        }).then(() => {
                          if (blogFound) {
                            return res.status(201).json(blogFound);
                          } else {
                            return res.status(500).json({
                              'error': 'cannot update blog'
                            });
                          }
                        }).catch((err) => {
                          res.status(500).json({
                            'error': 'cannot update blog like counter'
                          });
                        });
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          'error': 'unable to set user reaction'
                        });
                      });
                  } else {
                    if (userAlreadyLikedFound.isLike === DISLIKED) {
                      userAlreadyLikedFound.update({
                        isLike: LIKED,
                      }).then(() => {
                        blogFound.update({
                          likes: blogFound.likes + 1
                        }).then(() => {
                          if (blogFound) {
                            return res.status(201).json(blogFound);
                          } else {
                            return res.status(500).json({
                              'error': 'cannot update blog'
                            });
                          }
                        }).catch((err) => {
                          res.status(500).json({
                            'error': 'cannot update blog like counter'
                          });
                        });
                      }).catch((err) => {
                        res.status(500).json({
                          'error': 'cannot update user reaction'
                        });
                      });
                    } else {
                      res.status(409).json({
                        'error': 'blog already liked'
                      });
                    }
                  }
                })
                .catch((err) => {
                  return res.status(500).json({
                    'error': 'unable to verify is user already liked'
                  });
                });
            } else {
              res.status(404).json({
                'error': 'user not exist'
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              'error': 'unable to verify user'
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        'error': 'unable to verify blog'
      });
    });
}

exports.dislikePost = (req, res) => {

  const userId = 2;
  // Params
  const blogId = 1;

  if (blogId <= 0) {
    return res.status(400).json({
      'error': 'invalid parameters'
    });
  }

  console.log(blogId);
  Blog.findOne({
      where: {
        id: blogId
      }
    })
    .then(blogFound => {
      console.log(blogFound);
      if (blogFound) {
        User.findOne({
            where: {
              id: userId
            }
          })
          .then(userFound => {
            if (userFound) {
              Like.findOne({
                  where: {
                    userId: userId,
                    blogId: blogId
                  }
                })
                .then(userAlreadyLikedFound => {
                  if (!userAlreadyLikedFound) {
                    blogFound.setUser(userFound)
                      .then(() => {
                        Like.create({
                          userId: userId,
                          blogId: blogId,
                          isLike: DISLIKED
                        })
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          'error': 'error to create like'
                        });
                      })
                      .then(alreadyLikeFound => {
                        blogFound.update({
                          likes: blogFound.likes
                        }).then(() => {
                          if (blogFound) {
                            return res.status(201).json(blogFound);
                          } else {
                            return res.status(500).json({
                              'error': 'cannot update blog'
                            });
                          }
                        }).catch((err) => {
                          res.status(500).json({
                            'error': 'cannot update blog like counter'
                          });
                        });
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          'error': 'unable to set user reaction'
                        });
                      });
                  } else {
                    if (userAlreadyLikedFound.isLike === LIKED) {
                      userAlreadyLikedFound.update({
                        isLike: DISLIKED,
                      }).then(() => {
                        blogFound.update({
                          likes: blogFound.likes - 1
                        }).then(() => {
                          if (blogFound) {
                            return res.status(201).json(blogFound);
                          } else {
                            return res.status(500).json({
                              'error': 'cannot update blog'
                            });
                          }
                        }).catch((err) => {
                          res.status(500).json({
                            'error': 'cannot update blog like counter'
                          });
                        });
                      }).catch((err) => {
                        res.status(500).json({
                          'error': 'cannot update user reaction'
                        });
                      });
                    } else {
                      res.status(409).json({
                        'error': 'blog already disliked'
                      });
                    }
                  }
                })
                .catch((err) => {
                  return res.status(500).json({
                    'error': 'unable to verify is user already liked'
                  });
                });
            } else {
              res.status(404).json({
                'error': 'user not exist'
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              'error': 'unable to verify user'
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        'error': 'unable to verify blog'
      });
    });
}