const db = require('../config/db.config');
const Blog = db.blog;
const Like = db.like;
const User = db.user;
// Constants
const DISLIKED = -1;
const LIKED = 1;
const NONE = 0;

exports.votePost = (req, res) => {
    let like = req.body.like;
    console.log('req.body', like);
    const userId = req.body.userId;
    // Params
    let blogId = parseInt(req.params.id);

    if (blogId <= 0 || like < -1 || like > 1) {
        return res.status(400).json({
            'error': 'invalid parameters'
        });
    }

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
                        console.log(userFound.name);
                        if (userFound) {
                            Like.findOne({
                                    where: {
                                        userId: userId,
                                        blogId: blogId
                                    }
                                })
                                .then(userAlreadyLikedFound => {
                                    console.log('blogId', blogId);
                                    console.log('userId', userId);
                                    console.log('vote', like);
                                    console.log('blogId', typeof(blogId));
                                    console.log('userId', typeof(userId));
                                    console.log('vote', typeof(like));
                                    // console.log(userAlreadyLikedFound);
                                    if (!userAlreadyLikedFound) {
                                        
                                        blogFound.addUser(userFound, {through: {
                                            isLike: 1
                                        }}).then(elm=>{
                                                                     
                                            console.log(elm)
                                        })
                                            // .then()
                                            // Like.create({
                                            //     userId: userId,
                                            //     blogId: blogId,
                                            //     isLike: like
                                            // })
                                            // .catch((err) => {
                                            //     return res.status(500).json({
                                            //         'error': 'error to create like'
                                            //     });
                                            // })
                                            .then(alreadyLikeFound => {
                                                let originalUserId = blogFound.userId;
                                                console.log('blogfundU',originalUserId);
                                                blogFound.update({
                                                    likes: blogFound.likes + like
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

                                        //------
                                        let oldUserLike = userAlreadyLikedFound.isLike;
                                        if (userAlreadyLikedFound.isLike !== like) {
                                            userAlreadyLikedFound.update({
                                                isLike: like,
                                            }).then(() => {
                                                //calc new valeur
                                                console.log('old likes', blogFound.likes);
                                                console.log('old userlike', oldUserLike);
                                                console.log('new userlike', like);
                                                let likeValue;
                                                if (like === 0){
                                                    likeValue = blogFound.likes 
                                                } else {
                                                    likeValue = blogFound.likes + like                                                                                             
                                                }
                                                let newValue = {
                                                    likes: likeValue
                                                }
                                                blogFound.update(newValue).then(() => {
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
                                        } /////------
                                        else {
                                            userAlreadyLikedFound.update({
                                                isLike: NONE,
                                            }).then(() => {
                                                //calc new valeur
                                                let newValue = {
                                                    likes: blogFound.likes - like 
                                                }
                                                blogFound.update(newValue).then(() => {
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
        })
}

exports.getAllVotes = (req, res) => {
    Like.findAll().then(
        (likes) => {
            res.status(200).json(likes);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}

exports.getAllBlogWithVotes = (req, res) => {
    Blog.findAll({
        include: [{
          model:User,
          through: {
            attributes: ['blogId', 'userId'],
          }
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