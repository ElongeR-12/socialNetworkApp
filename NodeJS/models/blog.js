module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define('blogs', {
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
    },
    likes: {
      type: Sequelize.INTEGER
    }
  }, {
    underscored: false
  });

  return Blog;
}

