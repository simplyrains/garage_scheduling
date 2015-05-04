'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Technician = mongoose.model('Technician'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, technician;

/**
 * Technician routes tests
 */

 /*
describe('Technician CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Technician
		user.save(function() {
			technician = {
				name: 'Technician Name'
			};

			done();
		});
	});

	it('should be able to save Technician instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Technician
				agent.post('/technicians')
					.send(technician)
					.expect(200)
					.end(function(technicianSaveErr, technicianSaveRes) {
						// Handle Technician save error
						if (technicianSaveErr) done(technicianSaveErr);

						// Get a list of Technicians
						agent.get('/technicians')
							.end(function(techniciansGetErr, techniciansGetRes) {
								// Handle Technician save error
								if (techniciansGetErr) done(techniciansGetErr);

								// Get Technicians list
								var technicians = techniciansGetRes.body;

								// Set assertions
								(technicians[0].user._id).should.equal(userId);
								(technicians[0].name).should.match('Technician Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Technician instance if not logged in', function(done) {
		agent.post('/technicians')
			.send(technician)
			.expect(401)
			.end(function(technicianSaveErr, technicianSaveRes) {
				// Call the assertion callback
				done(technicianSaveErr);
			});
	});

	it('should not be able to save Technician instance if no name is provided', function(done) {
		// Invalidate name field
		technician.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Technician
				agent.post('/technicians')
					.send(technician)
					.expect(400)
					.end(function(technicianSaveErr, technicianSaveRes) {
						// Set message assertion
						(technicianSaveRes.body.message).should.match('Please fill Technician name');
						
						// Handle Technician save error
						done(technicianSaveErr);
					});
			});
	});

	it('should be able to update Technician instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Technician
				agent.post('/technicians')
					.send(technician)
					.expect(200)
					.end(function(technicianSaveErr, technicianSaveRes) {
						// Handle Technician save error
						if (technicianSaveErr) done(technicianSaveErr);

						// Update Technician name
						technician.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Technician
						agent.put('/technicians/' + technicianSaveRes.body._id)
							.send(technician)
							.expect(200)
							.end(function(technicianUpdateErr, technicianUpdateRes) {
								// Handle Technician update error
								if (technicianUpdateErr) done(technicianUpdateErr);

								// Set assertions
								(technicianUpdateRes.body._id).should.equal(technicianSaveRes.body._id);
								(technicianUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Technicians if not signed in', function(done) {
		// Create new Technician model instance
		var technicianObj = new Technician(technician);

		// Save the Technician
		technicianObj.save(function() {
			// Request Technicians
			request(app).get('/technicians')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Technician if not signed in', function(done) {
		// Create new Technician model instance
		var technicianObj = new Technician(technician);

		// Save the Technician
		technicianObj.save(function() {
			request(app).get('/technicians/' + technicianObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', technician.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Technician instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Technician
				agent.post('/technicians')
					.send(technician)
					.expect(200)
					.end(function(technicianSaveErr, technicianSaveRes) {
						// Handle Technician save error
						if (technicianSaveErr) done(technicianSaveErr);

						// Delete existing Technician
						agent.delete('/technicians/' + technicianSaveRes.body._id)
							.send(technician)
							.expect(200)
							.end(function(technicianDeleteErr, technicianDeleteRes) {
								// Handle Technician error error
								if (technicianDeleteErr) done(technicianDeleteErr);

								// Set assertions
								(technicianDeleteRes.body._id).should.equal(technicianSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Technician instance if not signed in', function(done) {
		// Set Technician user 
		technician.user = user;

		// Create new Technician model instance
		var technicianObj = new Technician(technician);

		// Save the Technician
		technicianObj.save(function() {
			// Try deleting Technician
			request(app).delete('/technicians/' + technicianObj._id)
			.expect(401)
			.end(function(technicianDeleteErr, technicianDeleteRes) {
				// Set message assertion
				(technicianDeleteRes.body.message).should.match('User is not logged in');

				// Handle Technician error error
				done(technicianDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Technician.remove().exec();
		done();
	});
});
*/