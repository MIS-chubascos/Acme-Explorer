'use strict';
module.exports = function(app) {
	var dataWareHouse = require('../controllers/dataWareHouseController');
	var authController = require('../controllers/authController');
	const V1_API_PATH = '/api/v1';
	const V2_API_PATH = '/api/v2';

	// V1 methods

  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route(V1_API_PATH + '/dataWareHouse')
		.get(dataWareHouse.listAllIndicators)
		.post(dataWareHouse.rebuildPeriod);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route(V1_API_PATH + '/dataWareHouse/latest')
		.get(dataWareHouse.lastIndicator);

	app.route(V1_API_PATH + '/populate')
		.get(dataWareHouse.populate);

	app.route(V1_API_PATH + '/dataWareHouse/cube')
		.get(dataWareHouse.getCube);

	app.route(V1_API_PATH + '/dataWareHouse/cubeAdvanced')
		.get(dataWareHouse.getCubeAdvanced);

	// V2 methods

	app.route(V2_API_PATH + '/dataWareHouse')
		.get(authController.verifyUser(['ADMINISTRATOR']), dataWareHouse.listAllIndicators)
		.post(authController.verifyUser(['ADMINISTRATOR']), dataWareHouse.rebuildPeriod);

	app.route(V2_API_PATH + '/dataWareHouse/latest')
		.get(authController.verifyUser(['ADMINISTRATOR']), dataWareHouse.lastIndicator);

	app.route(V2_API_PATH + '/dataWareHouse/cube')
		.get(authController.verifyUser(['ADMINISTRATOR']), dataWareHouse.getCube);

	app.route(V1_API_PATH + '/dataWareHouse/cubeAdvanced')
		.get(authController.verifyUser(['ADMINISTRATOR']), dataWareHouse.getCubeAdvanced);

};
