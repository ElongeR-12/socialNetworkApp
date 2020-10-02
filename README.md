* # Description

This project aims to create social Netork application. First I will try to create a secured users registration and login. Three users role is defined to make hierarchical privileges. Then CRUD operation will be realized allowing users to share multimedia or text content. Technologies: Node JS, Express, MySQL, sequelize, Angular cli

* # Back-end & RestAPIs

    * Connect MySQL Database Server from Node.js
        * [Connecting to the MySQL Database Server from Node.js](https://www.mysqltutorial.org/mysql-nodejs/connect/)
    
    * Create User and Role sequelize models
        * [Sequelize](https://sequelize.org/) || [Model Basics](https://sequelize.org/master/manual/model-basics.html) || [Models - Definition](https://sequelize.readthedocs.io/en/2.0/docs/models-definition/)

    * User & Roles Relationship model
        * [Many-to-many relationships](https://fmhelp.filemaker.com/help/18/fmp/en/index.html#page/FMP_Help/many-to-many-relationships.html) || [Relations / Associations](https://sequelize.readthedocs.io/en/latest/docs/associations/) || [Setting up a connection](https://sequelize.readthedocs.io/en/2.0/docs/getting-started/) || [Junction Model Pattern: Many-to-Many - Sequelize](https://khalilstemmler.com/articles/sequelize-tags-junction-pattern/) || [Sequelize Many-to-Many Association example – Node.js & MySQL](https://bezkoder.com/sequelize-associate-many-to-many/) || [Sequelize Many-to-Many association – NodeJS/Express, MySQL](https://grokonez.com/node-js/sequelize-many-to-many-association-nodejs-express-mysql)

    * Sequelize Database Configuration
        * [Pooling connections](https://www.npmjs.com/package/mysql#pooling-connections) || [Initialize Sequelize](https://bezkoder.com/node-js-express-sequelize-mysql/)

    * Implement user and userPrivilege controllers
        * [Joins/Includes (aka "Eager Loading")](https://sequelizedocs.fullstackacademy.com/eager-loading/#joinsincludes-aka-eager-loading) || [Operators](https://sequelize.org/master/manual/model-querying-basics.html#operators) || ["Select" Clauses ("attributes")](https://sequelizedocs.fullstackacademy.com/querying/#select-clauses-attributes) || [Associations » Many-Many Associations - through](https://sequelizedocs.fullstackacademy.com/many-many-associations/)
    * Implement like and dislike api
        * [API REST Node.js • Création d'un système d'avis "j'aime" / "j'aime pas"](https://www.youtube.com/watch?v=SMA-JDHSLEw)
    * Use special methods/mixins added to instances
        * [Special methods/mixins added to instances](https://sequelize.org/master/manual/assocs.html)
        * [Inserting / Updating belongsToMany Association with additional attributes](https://github.com/sequelize/sequelize/issues/8381)
    * fix bug to allow delete request
        * [CORS error :Request header field Authorization is not allowed by Access-Control-Allow-Headers in preflight response](https://www.xspdf.com/help/50444602.html)
    * Pagination from server
        * [Server side Pagination in Node.js with Sequelize & MySQL](https://bezkoder.com/node-js-sequelize-pagination-mysql/)
    * Joi validator
        * [Node.js + Express API - Request Schema Validation with Joi](https://jasonwatmore.com/post/2020/07/22/nodejs-express-api-request-schema-validation-with-joi)
        * [Joi offiial documentation](https://joi.dev/api/?v=17.2.1#stringalphanum)
* # Client Side part 

    * Implement token-storage.service
        * [Typescript Class](https://www.typescriptlang.org/docs/handbook/classes.html#introduction) || [Public, private, and protected modifiers assigned in members of class](https://www.typescriptlang.org/docs/handbook/classes.html#public-private-and-protected-modifiers) || [Add service, why?, how?, and how to set providedIn Injectable](https://angular.io/tutorial/toh-pt4#add-services)
    
    * Create Http Receptor
        * [Intercepting requests and responses](https://angular.io/guide/http#intercepting-requests-and-responses) || [Setting default headers](https://angular.io/guide/http#setting-default-headers) || [Angular HTTP Interceptor - Build An Authentication Interceptor (Step-by-Step Implementation)](https://www.youtube.com/watch?v=suTtA0Hlwlk) || [HTTP interceptors in Angular](https://blog.angulartraining.com/http-interceptors-in-angular-61dcf80b6bdd)

    * Implement appComponent 
        * [OnInit lifecycle hook](https://angular.io/api/core/OnInit#oninit) || [Using ngOnInit Lifecycle hook](https://www.youtube.com/watch?v=YYT5zIRBn8A)
    
    * Implement auth Service
        * [Observables in Angular](https://angular.io/guide/observables-in-angular#observables-in-angular) || [The RxJS library](https://angular.io/guide/rx-library#the-rxjs-library) || [TypeSrypt, Basic Types, Array](https://www.typescriptlang.org/docs/handbook/basic-types.html#array) || [Communicating with backend services using HTTP](https://angular.io/guide/http#communicating-with-backend-services-using-http) || [Adding and updating headers](https://angular.io/guide/http#adding-and-updating-headers) || [Sending data to a server, Making a POST request](https://angular.io/guide/http#sending-data-to-a-server)
    
    * Implement login component 
        * [Hooking into the component lifecycle](https://angular.io/guide/lifecycle-hooks#hooking-into-the-component-lifecycle)
    * Implement user_roles component
        * [Subscription](https://rxjs.dev/guide/subscription)
    * Update user template to output post with image or text
        * [Show Image Preview with Reactive](https://www.positronx.io/angular-8-show-image-preview-with-reactive-forms-tutorial/)
        * [Template Driven Form – NgModel for Two-Way Data Binding](https://grokonez.com/frontend/angular/angular-6/angular-6-template-driven-form-ngmodel-for-two-way-data-binding)
    * Update user component for uploading and post
        * [Angular Image Upload](https://www.youtube.com/watch?v=YkvqLNcJz3Y)
    * Manage like in template
        * [Mise en pratique de RxJS dans Angular](https://makina-corpus.com/blog/metier/2017/premiers-pas-avec-rxjs-dans-angular)
        * [HTML5 Data Attributes in Angular 10/9](https://www.techiediaries.com/add-access-html-data-attribute-angular/)
    * Manage pagination in client-side
        * [Angular 10 Pagination example | ngx-pagination](https://bezkoder.com/angular-10-pagination-ngx/)
            
