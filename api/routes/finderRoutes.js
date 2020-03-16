'use strict';

module.exports = function(app) {
    var finders = require('../controllers/finderController');
    var authController = require('../controllers/authController');
    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/finders/:finderId')
        .get(finders.getFinder)
        .put(finders.updateFinder);

    app.route(V1_API_PATH + '/finders/:finderId/trips')
        .get(finders.getTripsByFinder);

    // V2 methods
    app.route(V2_API_PATH + '/finders/:finderId')
        .get(authController.verifyUser(['EXPLORER']), finders.getFinder)
        .put(authController.verifyUser(['EXPLORER']), finders.updateFinder);

    app.route(V2_API_PATH + '/finders/:finderId/trips')
        .get(authController.verifyUser(['EXPLORER']), finders.getTripsByFinder);
    
}