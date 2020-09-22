const connect = require('./connect.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(connect.database, connect.username, connect.password, {
  host: connect.host,
  dialect: connect.dialect,
  operatorsAliases: false,
 
  pool: {
    max: connect.max,
    min: connect.pool.min,
    acquire: connect.pool.acquire,
    idle: connect.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blog = require('../models/blog')(sequelize, Sequelize);
db.user = require('../models/user')(sequelize, Sequelize);
db.role = require('../models/role')(sequelize, Sequelize);
db.like = require('../models/like')(sequelize, Sequelize);
 
//create user and role association
//through user_roles tables, an extra junction table 
// extra table require two foreignKey
db.role.belongsToMany(db.user, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId'});
db.user.belongsToMany(db.role, {through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});

// create blog association, add userId column to blog tables
db.blog.belongsTo(db.user,{foreignKey: {
  allowNull: false
}});
db.user.hasMany(db.blog);
//create blog and user association
//through like tables, an extra junction table 
db.user.belongsToMany(db.blog, {as: 'likers', through: db.like, foreignKey: 'userId', otherKey: 'blogId'});
db.blog.belongsToMany(db.user, {as: 'likers', through: db.like, foreignKey: 'blogId', otherKey: 'userId'});

module.exports = db;