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
      type: Sequelize.TEXT
    }

  }, {
    underscored: false
  });

  return Blog;
}

