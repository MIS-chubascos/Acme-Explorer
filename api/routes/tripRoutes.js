'use strict';
module.exports = function(app) {
    var trips = require('../controllers/tripController');

    app.route('/trips')
        .get(trips.getAllTrips)
        .post(trips.createTrip)
        .get(trips.getTripsPerManagerData);

    app.route('/trips/:tripId')
        .get(trips.getTrip)
        .get(trips.getTripApplications)
        .put(trips.updateTrip)
        .delete(trips.deleteTrip);

}