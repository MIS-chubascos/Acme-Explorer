'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');

    app.route('/trips')
        .get(trips.getAllTrips)
        .post(trips.createTrip)

    app.route('/trips/:tripId')
        .get(trips.getTrip)
        .put(trips.updateTrip)
        .delete(trips.deleteTrip);

    app.route('/trips/:tripId/cancel')
        .post(trips.cancelTrip)

    app.route('/trips/:tripId/tripApplications')
        .post(trips.createTripApplication);
}