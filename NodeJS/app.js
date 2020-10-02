const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const userPrivilegeRoutes = require('./routes/user.privilege');
const postBlog = require('./routes/blog');
const likeBlog = require('./routes/like');
const uploadBlog = require('./routes/upload');
const db = require('./config/db.config');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
const session = require('express-session');
const helmet = require("helmet");
const { sequelize } = require('./config/db.config');
const dotenv = require('dotenv').config();
app.use(session({
    secret: process.env.SECRET,// used to sign the session ID cookie
    name: process.env.SESSION_NAME,//change session cookie name
    cookie: {
        httpOnly: true,// prevent client side Javascript to see the cookie
        secure: true, /*when using https*/
        maxAge: 60 * 60 * 1000,
        domain:'http://localhost:8080' 
    }
}));
app.use(helmet());
const Role = db.role;
sequelize.query('show tables')
.then((rows) =>{
    if(rows[0].length > 0){
        db.sequelize.sync({
            force: false 
        })
    }else{
        db.sequelize.sync({
            force: true 
        }).then(() => {
            initial();  
        });
    }
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
app.use('/api/privilege', userPrivilegeRoutes);
app.use('/api/blogs/', postBlog);
app.use('/api/upload/', uploadBlog);
app.use('/api/blogs', likeBlog);
module.exports = app;