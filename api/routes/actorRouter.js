'use strict'

module.exports = function (app) {
    var actor = require('../controllers/actorController');
    var authController = require('../controllers/authController');
    /**
     * Get actors
     *      Required role: Admin
     * Post an actor
     *      RequiredRoles: Admin
     * 
     *  @section actors
     *   @type get post
     *   @url /v1/actors
     **/
    app.route('/v1/actors')
        .get(actor.list_all_actors)
        .post(actor.create_an_actor)
    /**
     * Put an actor
     *   RequiredRoles: be the proper actor
     * Get an actor
     *   RequiredRoles: be the proper actor or admin
     * Delete an actor
     * RequiredRoles: be the proper actor or an admin
     * 
     * @section actors
     * @type get put delete
     * @url /v1/actors/:actorId
     */
    app.route('/v1/actors/actorId')
        .get(actor.read_an_actor)
        .put(actor.update_an_actor)
        .delete(actor.delete_an_actor)

    /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */
 app.route('/v1/actors/:actorId')
 .put(authController.verifyUser(["ADMINISTRATOR", "MANAGER", "EXPLORER", "SPONSOR"]), actor.update_an_actor)

};