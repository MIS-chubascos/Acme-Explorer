'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');

    app.route('/trips')
        .get(trips.getAllTrips)
        .get(trips.searchTrips)
        .post(trips.createTrip);

    app.route('/trips/:tripId')
        .get(trips.getTrip)
        .get(trips.getTripApplications)
        .put(trips.updateTrip)
        .delete(trips.deleteTrip);

    app.route('/trips/:tripId/tripApplications')
        .post(trips.createTripApplication);
}