module.exports = (sequelize, Sequelize) => {
	const Like = sequelize.define('likes', {
      isLike: {
        type: Sequelize.INTEGER
      }
	});
	return Like;
}

