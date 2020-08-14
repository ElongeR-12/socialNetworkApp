module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define('blogs', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      required: true
    },
    content: {
      type: Sequelize.TEXT,
      required: false
    },
    imageUrl: {
      type: Sequelize.STRING,
      required: false,
    },
    postType: {
      type: Sequelize.STRING
    }

  }, {
    underscored: false
  });

  return Blog;
}

