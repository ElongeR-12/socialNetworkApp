module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      likeValue: {
        type: Sequelize.INTEGER
      },
      likeUsername: {
        type: Sequelize.STRING,
        required: true
      },
      likeUserId: {
        type: Sequelize.INTEGER,
        required: true
      },
	}, {
        underscored: false
      });

	return Like;
}

