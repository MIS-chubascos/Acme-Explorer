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
        .get(trips.getTripV1)
        .put(trips.updateTripV1)
        .delete(trips.deleteTripV1);

    app.route(V1_API_PATH + '/trips/:tripId/cancel')
        .post(trips.cancelTripV1)

    app.route(V1_API_PATH + '/trips/:tripId/tripApplications')
        .post(trips.createTripApplicationV1);

    // V2 methods
    app.route(V2_API_PATH + '/trips')
    .post(authController.verifyUser(['MANAGER']), trips.createTrip);

    app.route(V2_API_PATH + '/trips/:tripId')
        .get(authController.verifyUser(['ADMINISTRATOR','MANAGER','EXPLORER','SPONSOR']), trips.getTripV2) //All actors can see a trip. V2 is needed in this method because if a trip is not published yet, only the manager who created it can see it
        .put(authController.verifyUser(['MANAGER']), trips.updateTripV2)
        .delete(authController.verifyUser(['MANAGER']), trips.deleteTripV2);

    app.route(V2_API_PATH + '/trips/:tripId/cancel')
        .post(authController.verifyUser(['MANAGER']), trips.cancelTripV2);

    app.route(V2_API_PATH + '/trips/:tripId/tripApplications')
        .post(authController.verifyUser(['EXPLORER']), trips.createTripApplicationV2);
        
}