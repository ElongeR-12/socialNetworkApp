const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const userPrivilegeRoutes = require('./routes/user.privilege');
const db = require('./config/db.config');
const app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
const Role = db.role;

// force: true will drop the table if it already exists
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync with { force: true }');
  initial();
});
function initial() {
	Role.create({
		id: 1,
		name: "USER"
	});

	Role.create({
		id: 2,
		name: "PM"
	});

	Role.create({
		id: 3,
		name: "ADMIN"
	});
}
app.use(bodyParser.json());	
app.use('/api/auth', userRoutes);
app.use('/api/test', userPrivilegeRoutes);	
module.exports = app;

	
