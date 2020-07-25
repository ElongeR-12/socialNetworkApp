* Description

This project aims to create social Netork application. First I will try to create a secured users registration and login. Three users role is defined to make hierarchical privileges. Then CRUD operation will be realized allowing users to share multimedia or text content. Technologies: Node JS, Express, MySQL, sequelize, Angular cli

* users and roles RestAPIs

    * Connect MySQL Database Server from Node.js
        * documentation(https://www.mysqltutorial.org/mysql-nodejs/connect/)
    
    * Create User and Role sequelize models
        * documentation
            * https://sequelize.org/
            * https://sequelize.org/master/manual/model-basics.html
            * https://sequelize.readthedocs.io/en/2.0/docs/models-definition/

    * User & Roles Relationship model
        * documentation
            * https://fmhelp.filemaker.com/help/18/fmp/en/index.html#page/FMP_Help/many-to-many-relationships.html
            * https://sequelize.readthedocs.io/en/latest/docs/associations/
            * Setting up a connection (https://sequelize.readthedocs.io/en/2.0/docs/getting-started/)
            * https://khalilstemmler.com/articles/sequelize-tags-junction-pattern/
            * https://bezkoder.com/sequelize-associate-many-to-many/
            * https://grokonez.com/node-js/sequelize-many-to-many-association-nodejs-express-mysql

    * Sequelize Database Configuration
        * documentation
            * https://www.npmjs.com/package/mysql#pooling-connections
            * Initialize Sequelize (https://bezkoder.com/node-js-express-sequelize-mysql/)

    * Implement user and userPrivilege controllers
        * documentation
            * Joins/Includes (aka "Eager Loading"): https://sequelizedocs.fullstackacademy.com/eager-loading/#joinsincludes-aka-eager-loading
            * Operators: https://sequelize.org/master/manual/model-querying-basics.html#operators
            * "Select" Clauses ("attributes"): https://sequelizedocs.fullstackacademy.com/querying/#select-clauses-attributes
            * Associations » Many-Many Associations - through: https://sequelizedocs.fullstackacademy.com/many-many-associations/