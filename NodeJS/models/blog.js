module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define('blogs', {
    id: {
      //Sequelize = DataTypes
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
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

