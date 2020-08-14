const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const userPrivilegeRoutes = require('./routes/user.privilege');
const postBlog = require('./routes/blog');
const likeBlog = require('./routes/like');
const db = require('./config/db.config');
const path = require('path');
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});
const Role = db.role;
db.sequelize.sync({
  force: true
}).then(() => {
  initial();
});

async function initial() {
  try {
    const role = await Role.create({
      id: 1,
      name: "USER"
    });
    const role2 = await Role.create({
      id: 2,
      name: "PM"
    });
    const role3 = await Role.create({
      id: 3,
      name: "ADMIN"
    });
    console.log('success', role.toJSON());
    console.log('success', role2.toJSON());
    console.log('success', role3.toJSON());

  } catch (err) {
    console.log(err);
  }
}
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/test', userPrivilegeRoutes);
app.use('/api/create/', postBlog);
app.use('/api/create/', likeBlog);
module.exports = app;