const env = require('./env.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.blog = require('../models/blog')(sequelize, Sequelize);
db.user = require('../models/user')(sequelize, Sequelize);
db.role = require('../models/role')(sequelize, Sequelize);
db.like = require('../models/like')(sequelize, Sequelize);
 
db.user.belongsToMany(db.role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId'});
db.blog.belongsTo(db.user,{foreignKey: 'userId'});

db.user.hasOne(db.blog, {foreignKey: 'userId'});
// db.user.hasMany(db.blog, {foreignKey: 'userId'});
// db.user.hasMany(db.like, {foreignKey: 'userId'});
// db.blog.belongsTo(db.user, {foreignKey: 'userId'});
// db.blog.hasMany(db.like, {foreignKey: 'blogId'})
// db.like.belongsTo(db.user, {foreignKey: 'userId', as: "liker"});
// db.like.belongsTo(db.blog, {foreignKey: 'blogId'});

db.user.belongsToMany(db.blog, {
  through: db.like,
  foreignKey: 'userId',
  otherKey: 'blogId',
});

db.blog.belongsToMany(db.user, {
  through: db.like,
  foreignKey: 'blogId',
  otherKey: 'userId',
});

module.exports = db;