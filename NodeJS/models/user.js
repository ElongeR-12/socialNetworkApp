module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			defaultValue: Sequelize.INTEGER,
			allowNull: false
		  },
		name: {
			type: Sequelize.STRING
		},
		username: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		}
	},{
        underscored: false
      });
	
	return User;
}