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

var routesFinders = require('./api/routes/finderRoutes')
var routesTrips = require('./api/routes/tripRoutes');
var routesTripApplications = require('./api/routes/tripApplicationRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesActors = require('./api/routes/actorRoutes')
var routesConfig = require('./api/routes/configRoutes')

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


console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});
