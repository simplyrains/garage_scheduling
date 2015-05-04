'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var insurances = require('../../app/controllers/insurances.server.controller');

	// Insurances Routes
	app.route('/insurances')
		.get(insurances.list)
		.post(users.requiresLogin, insurances.create);

	app.route('/insurances/:insuranceId')
		.get(insurances.read)
		.put(users.requiresLogin, insurances.hasAuthorization, insurances.update)
		.delete(users.requiresLogin, insurances.hasAuthorization, insurances.delete);

	// Finish by binding the Insurance middleware
	app.param('insuranceId', insurances.insuranceByID);
};
