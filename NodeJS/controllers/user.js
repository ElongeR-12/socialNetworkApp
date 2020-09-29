const db = require('../config/db.config');
const config = require('../config/config');
const fs = require('fs');
const User = db.user;
const Role = db.role;
const Blog = db.blog;
const Like = db.like;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findOne({
			where: {
				name: 'admin'
			}
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.send({
					message: 'Registered successfully!'
				});
			});
		}).catch(err => {
			res.status(500).send({
				reason: err.message
			});
		});
	}).catch(err => {
		res.status(500).send({
			reason: err.message
		});
	})
}

exports.signin = (req, res) => {
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({
				reason: 'User Not Found.'
			});
		}

		const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({
				auth: false,
				accessToken: null,
				reason: 'Invalid Password!'
			});
		}

		const token = jwt.sign({
			id: user.id
		}, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});

		let authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push('ROLE_' + roles[i].name.toUpperCase());
			}
			res.status(200).json({
				auth: true,
				accessToken: token,
				username: user.username,
				userId: user.id,
				authorities: authorities
			});
		})
	}).catch(err => {
		res.status(500).send({
			reason: err.message
		});
	});
}

exports.getOneUser = (req, res, next) => {
	User.findOne({
		where: {
			id: req.params.id
		}
	}).then(
		(user) => {
			res.status(200).json(user);
		}
	).catch(
		(error) => {
			res.status(404).json({
				error: error
			});
		}
	);
};

exports.deleteUser = (req, res, next) => {
	const deleteBlogAndUser = (blog, user) =>{
		blog.forEach(element => {
			const filename = element.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				element.destroy()
				.then(() => {
					deleteUser(user)
				})
				.catch(error => res.status(400).json({
					error
				}));
			});
		});
	}
	const deleteUser = (userToDelete) =>{
		userToDelete.destroy()
		.then(() => res.status(200).json({
			message: 'Objet supprimé !'
		}))
		.catch(() => {
			return res.status(500).json({
				'error': 'can not remove user'
			});
		})
	}

	User.findOne({
			where: {
				id: req.params.id
			}
	})
	.then((exist) => {
		Like.findAll({
			where: {
				userId: req.params.id
			}
		})
		.then((like)=>{
			if (like.length>0){
				Blog.findAll({
					include: [
						{ 
							model: User,
							attributes: ['id', 'name'],
							model: User,
							as: 'likers',
							attributes: ['id', 'name'],
							where: {
								id: req.params.id
							}
						}
					]
				})
				.then((blogs) => {
					if (blogs) {
						blogs.forEach(element => {
							console.log('les likes de ce likers', element.likers[0].likes['isLike']);
							element.update({
									likes: element.likes - element.likers[0].likes['isLike']
							})
							.then(() => {
								element.removeLikers(
										element.likers[0]
								)
								.then(() => {
									Blog.findAll({
										include: [
											{
												model: User,
												attributes: ['id', 'name'],
												where: {
													id: req.params.id
												}
											}
										]
									})
									.then((blogsOfUser) => {
										if (blogsOfUser.length>0) {
											deleteBlogAndUser(blogsOfUser, exist)
										}else{
											deleteUser(exist)
										}
									})
									.catch(() => {
										return res.status(500).json({
											'error': 'unable find own blogs'
										});
									})
								})
								.catch(() => {
									return res.status(500).json({
										'error': 'unable to remove user reaction'
									});
								})
							})
							.catch(() => {
								return res.status(500).json({
									'error': 'cannot update blog like counter'
								});
							})
						})

					}	
				})
				.catch(() => {
					return res.status(500).json({
						'error': 'unable to fing blog with likers'
					});
				})

			} else{
				Blog.findAll({
					include: [
						{
							model: User,
							attributes: ['id', 'name'],
							where: {
								id: req.params.id
							}
						}
					]
				})
				.then((blogsOfUser) => {
					if (blogsOfUser.length>0) {
						deleteBlogAndUser(blogsOfUser, exist)
					}else{
						deleteUser(exist)
					}
				})
				.catch(() => {
					return res.status(500).json({
						'error': 'unable find own blogs'
					});
				})
			}
		})
		.catch(() => {
			return res.status(500).json({
				'error': 'no like setter by userId'
			});
		})
		
	})
	.catch(() => {
		return res.status(500).json({
			'error': 'unable to fing user'
		});
	})
};		