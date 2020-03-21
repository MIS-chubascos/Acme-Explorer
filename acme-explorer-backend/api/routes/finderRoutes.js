'use strict';

module.exports = function(app) {
    var finders = require('../controllers/finderController');
    var authController = require('../controllers/authController');
    const V1_API_PATH = '/api/v1';
    const V2_API_PATH = '/api/v2';

    // V1 methods
    app.route(V1_API_PATH + '/finders/:finderId')
        .get(finders.getFinderV1)
        .put(finders.updateFinderV1);

    app.route(V1_API_PATH + '/finders/:finderId/trips')
        .get(finders.getTripsByFinderV1);

    // V2 methods
    app.route(V2_API_PATH + '/finders/:finderId')
        .get(authController.verifyUser(['EXPLORER']), finders.getFinderV2)
        .put(authController.verifyUser(['EXPLORER']), finders.updateFinderV2);

    app.route(V2_API_PATH + '/finders/:finderId/trips')
        .get(authController.verifyUser(['EXPLORER']), finders.getTripsByFinderV2);
    
}