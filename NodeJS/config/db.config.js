const env = require('./env.js');
const Sequelize = require('sequelize');
const { BelongsTo } = require('sequelize');
const user = require('../models/user.js');
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
db.user.hasMany(db.blog);
db.blog.belongsTo(db.user);
db.blog.hasMany(db.like);
db.like.belongsTo(db.blog);

 
module.exports = db;