'use strict';

module.exports = function (app) {
    var config = require('../controllers/configController');

    app.route('/config')
        .get(config.getConfig)

    app.route('/config/:configId')
        .put(config.updateConfig)
}