module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
      isLike: {
        type: Sequelize.INTEGER
      }
	}, {
        underscored: false
      });

	return Like;
}

