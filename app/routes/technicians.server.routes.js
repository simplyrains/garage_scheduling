'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var technicians = require('../../app/controllers/technicians.server.controller');

	// Technicians Routes
	app.route('/technicians')
		.get(technicians.list)
		.post(users.requiresLogin, technicians.create);

	app.route('/technicians/:technicianId')
		.get(technicians.read)
		.put(users.requiresLogin, technicians.hasAuthorization, technicians.update)
		.delete(users.requiresLogin, technicians.hasAuthorization, technicians.delete);

	// Finish by binding the Technician middleware
	app.param('technicianId', technicians.technicianByID);
};
