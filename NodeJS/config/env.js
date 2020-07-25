const env = {
  database: 'socialnetdata',
  username: 'root',
  password: '123456',
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
 
module.exports = env;