'use strict';

module.exports = function(app) {
    var tripApplications = require('../controllers/tripApplicationController');

    app.route('/tripApplications/:tripApplicationId')
        .get(tripApplications.getAcceptedTripApplications)
        .get(tripApplications.getTripApplication)
        .put(tripApplications.updateTripApplication);
}