// Invoke 'strict' JavaScript mode
//set up for angular websocket server

'use strict';
var codeUtils = new require('./../app/utils/utils')();


// Load the module dependencies
var config = require('./config'),
        express = require('express'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override')




// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    var app = express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(express.static('./public'));

    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    require('../app/routes/pages.routes.js')(app);

    var clientErrorProcessor = require('../app/filters/clientErrorProcessor');
    var generalErrorProcessor = require('../app/filters/generalErrorProcessor');
    app.use(clientErrorProcessor);
    app.use(generalErrorProcessor);

    // Return the Express application instance

    //always place this as the last this is the 404 handler
    require('../app/routes/not.found.routes.js')(app);

    return app;
};