const db = require('../config/db.config');
const config = require('../config/config');
const fs = require('fs');
const User = db.user;
const Role = db.role;
const Blog = db.blog;
const Like = db.like;
const Op = db.Sequelize.Op;
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
			res.status(200).send({
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
	User.findOne({
		where: {
			id: req.params.id
		}
	})
	.then((exist)=>{
		if(exist){
			Blog.findAll({
				include: [{ 
					model: User,
					attributes: ['id', 'name'],
					model: User,
					as: 'likers',
					attributes: ['id', 'name'],
					through: ['userId', 'blogId']
				}]
			})
			.then((blogs) => {
				const targetData = blogs.filter(element => 
					element.likers.find(element => 
						element.id === parseInt(req.params.id)
					)
				);
		
				targetData.forEach(element => {
					let sumValues = [];
					let indexArr = [];
					element.likers.forEach(el => {
						const id = el.id;
						const isLike = el.likes.isLike;
						if (id === parseInt(req.params.id)) {
							sumValues.push(parseInt(isLike));
							indexArr.push(1);
						} else {
							sumValues.push(parseInt(isLike) * 0)
							indexArr.push(0);
						}
					})
					const reducer = (accumulator, currentValue) => accumulator + currentValue;
					const likeToRemove = sumValues.reduce(reducer);
					const index = indexArr.indexOf(1);
					element.update({
						likes: element.likes - likeToRemove
					})
					.then(() => {
						element.removeLikers(
							element.likers[index]
						)
						.then(() => {
							User.destroy({
								where: {
									id: req.params.id
								}
							})
						})
						.catch(()=>{
							return res.status(500).json({
								'error': 'unable to remove user reaction'
							});
						})
					})
					.catch(()=>{
						return res.status(500).json({
							'error': 'cannot update blog like counter'
						});
					})
				})
			})
			.catch(()=>{
				res.status(500).json({
					'error': 'error to query, blog associations with nested users and nested likes'
				});
			});
			
			Blog.findAll({
				where: {
					userId: req.params.id
				}
			  })
			  .then(blogs => {
				blogs.forEach(element => {
				const filename = element.imageUrl.split('/images/')[1];
				fs.unlink(`images/${filename}`, () => {
				  element.destroy()
				  .then(() => res.status(200).json({
					message: 'Objet supprimé !'
				  }))
				  .catch(error => res.status(400).json({
					error
				  }));
				});
				});
			  })
			  .catch(error => res.status(500).json({
				error
			  }));
		}else{
			return res.status(404).json({
				'error': 'user not exist'
			});
		}
	})
};

