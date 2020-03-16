'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');
    var authController = require('../controllers/authController');
    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/trips')
        .get(trips.getAllTrips)
        .post(trips.createTrip)

    app.route(V1_API_PATH + '/trips/:tripId')
        .get(trips.getTrip)
        .put(trips.updateTrip)
        .delete(trips.deleteTrip);

    app.route(V1_API_PATH + '/trips/:tripId/cancel')
        .post(trips.cancelTrip)

    app.route(V1_API_PATH + '/trips/:tripId/tripApplications')
        .post(trips.createTripApplication);

    // V2 methods
    app.route(V2_API_PATH + '/trips')
    .post(authController.verifyUser(['MANAGER']), trips.createTrip);

    app.route(V2_API_PATH + '/trips/:tripId')
        .put(authController.verifyUser(['MANAGER']), trips.updateTrip)
        .delete(authController.verifyUser(['MANAGER']), trips.deleteTrip);

    app.route(V2_API_PATH + '/trips/:tripId/cancel')
        .post(authController.verifyUser(['MANAGER']), trips.cancelTrip);

    app.route(V2_API_PATH + '/trips/:tripId/tripApplications')
        .post(authController.verifyUser(['EXPLORER']), trips.createTripApplication);
        
}