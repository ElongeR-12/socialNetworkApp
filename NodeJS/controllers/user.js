const db = require('../config/db.config');
const config = require('../config/config');
const User = db.user;
const Role = db.role;
const Blog = db.blog;
const Like = db.like;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
	// Save User to Database
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findAll({
			where: {
				name: {
					[Op.or]: req.body.roles
				}
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

exports.deleteUser = (req, res, next) => {
	User.findOne({
		where: {
			id: req.params.id
		}
	})
	.then((exist)=>{
		if(exist){
			Blog.findAll({
				include: {
					all: true
				}
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
						console.log('le id', id);
						console.log('le likes', isLike);
						if (id === parseInt(req.params.id)) {
							sumValues.push(parseInt(isLike));
							indexArr.push(1);
						} else {
							sumValues.push(parseInt(isLike) * 0)
							indexArr.push(0);
						}
					})
					console.log('the values for sum', sumValues);
					console.log('index of the values in array', indexArr);
					const reducer = (accumulator, currentValue) => accumulator + currentValue;
					const likeToRemove = sumValues.reduce(reducer);
					console.log(likeToRemove);
					const index = indexArr.indexOf(1);
					console.log('l index', index);
					console.log(element.likers[index]);
		
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
			
			Blog.destroy({
				where: {
					userId: req.params.id
				}
			})
			.then(()=>{
				res.status(200).json("blogs created by user with userId "+ req.params.id + " are deleted seccessfully !");
			})
			.catch((err)=>{
				res.status(500).json({
					'error': 'cannot delete user with userId '+ req.params.id +' !'
				});
			})
		}else{
			return res.status(404).json({
				'error': 'user not exist'
			});
		}
	})
};