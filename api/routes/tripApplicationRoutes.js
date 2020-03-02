'use strict';

module.exports = function(app) {
    var tripApplications = require('../controllers/tripApplicationController');

    app.route('/tripApplications/accepted')
        .get(tripApplications.getAcceptedTripApplications);

    app.route('/tripApplications/:tripApplicationId')
        .get(tripApplications.getTripApplication)
        .put(tripApplications.updateTripApplication);
}