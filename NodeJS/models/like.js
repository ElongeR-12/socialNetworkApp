module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
	  id: {
        //Sequelize = DataTypes
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      likeValue: {
        type: Sequelize.INTEGER
      },
      commenterUsername: {
        type: Sequelize.STRING,
        required: true
      },
      commenterUserId: {
        type: Sequelize.INTEGER,
        required: true
      },
	}, {
        underscored: false
      });

	return Like;
}

