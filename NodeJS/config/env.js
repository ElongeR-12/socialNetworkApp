const env = {
  database: 'socialnetdata',
  username: 'root',
  password: 'Raharimalala12@',
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
