'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sas = require('../../app/controllers/sas.server.controller');

	// Sas Routes
	app.route('/sas')
		.get(sas.list)
		.post(users.requiresLogin, sas.create);

	app.route('/sas/:saId')
		.get(sas.read)
		.put(users.requiresLogin, sas.hasAuthorization, sas.update)
		.delete(users.requiresLogin, sas.hasAuthorization, sas.delete);

	// Finish by binding the Sa middleware
	app.param('saId', sas.saByID);
};
