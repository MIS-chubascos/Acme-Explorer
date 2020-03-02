'use strict';
module.exports = function(app) {
  var dataWareHouse = require('../controllers/dataWareHouseController');


  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/dataWareHouse')
	.get(dataWareHouse.listAllIndicators)
	.post(dataWareHouse.rebuildPeriod);

	app.route('/populate')
	.get(dataWareHouse.populate)

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/dataWareHouse/latest')
	.get(dataWareHouse.lastIndicator);
};
