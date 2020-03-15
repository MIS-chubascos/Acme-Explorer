var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Finder = require('./api/models/finderModel'),
  Trip = require('./api/models/tripModel'),
  TripApplication = require('./api/models/tripApplicationModel'),
  Config = require('./api/models/configModel'),
  Sponsorship = require('./api/models/sponsorshipModel'),
  Actor = require('./api/models/actorModel'),
  DataWareHouse = require('./api/models/dataWareHouseModel'),
  bodyParser = require('body-parser');
  admin = require('firebase-admin')
  serviceAccount = require('./acme-explorer-dc987-firebase-adminsdk-wn4ll-55a133b081.json')

var fs = require('fs');
var https = require('https');

const options = {
    key:fs.readFileSync('./keys/server.key'),  
    cert: fs.readFileSync('./keys/server.cert')
}


// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDBPass = process.env.mongoDBPass || "myUserPassword";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";

var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

mongoose.connect(mongoDBURI, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
    );
    //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

var routesFinders = require('./api/routes/finderRoutes')
var routesTrips = require('./api/routes/tripRoutes');
var routesTripApplications = require('./api/routes/tripApplicationRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesActors = require('./api/routes/actorRoutes')
var routesConfig = require('./api/routes/configRoutes')
var routesLogin = require('./api/routes/loginRoutes');

//From the project's firebase settings
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acme-explorer-dc987.firebaseio.com"
  });
 
routesFinders(app);
routesTrips(app);
routesTripApplications(app);
routesDataWareHouse(app);
routesSponsorship(app);
routesActors(app);
routesConfig(app);
routesLogin(app);

//Switch for front or back test
console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
   //Front test for logging https off
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
    //Back test, https on. Postman working
    //https.createServer(options, app).listen(port) 
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

module.exports= app;




