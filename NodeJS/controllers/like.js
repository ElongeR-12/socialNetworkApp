const db = require('../config/db.config');
const Blog = db.blog;
const Like = db.like;
const User = db.user;
exports.votePost = (req, res) => {
    const like = req.body.like;
    const userId = req.body.userId;
    // Params
    const blogId = parseInt(req.params.id);

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
                                    if (!userAlreadyLikedFound) {
                                        blogFound.addLikers(userFound, {through: {
                                            isLike: like
                                        }})
                                        .then(alreadyLikeFound => {
                                            blogFound.update({
                                                likes: blogFound.likes + like
                                            })
                                            .then(() => {
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
                                        if (userAlreadyLikedFound.isLike !== like) {
                                            userAlreadyLikedFound.update({
                                                isLike: like,
                                            })
                                            .then(() => {
                                                //calc new valeur
                                                blogFound.update({
                                                    likes: blogFound.likes + like                                                                                             
                                                })
                                                .then(() => {
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
                                                isLike: 0,
                                            })
                                            .then(() => {
                                                //calc new valeur
                                                blogFound.update({
                                                    likes: blogFound.likes - like 
                                                })
                                                .then(() => {
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


