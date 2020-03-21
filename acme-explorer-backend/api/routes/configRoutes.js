'use strict';

module.exports = function (app) {
    var config = require('../controllers/configController');

    app.route('/api/v1/config')
        .get(config.getConfig)

    app.route('/api/v1/config/:configId')
        .put(config.updateConfig)
}