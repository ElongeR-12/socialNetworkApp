module.exports = (sequelize, Sequelize) => {
	const Role = sequelize.define('roles', {
	  id: {
        //Sequelize = DataTypes
        type: Sequelize.INTEGER,
        primaryKey: true
	  },
	  name: {
		  type: Sequelize.STRING
	  }
	},{
        underscored: false
      });
	
	return Role;
}