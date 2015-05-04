'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sa = mongoose.model('Sa'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sa;

/**
 * Sa routes tests
 */
describe('Sa CRUD tests', function() {
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

		// Save a user to the test db and create new Sa
		user.save(function() {
			sa = {
				name: 'Sa Name'
			};

			done();
		});
	});

	it('should be able to save Sa instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sa
				agent.post('/sas')
					.send(sa)
					.expect(200)
					.end(function(saSaveErr, saSaveRes) {
						// Handle Sa save error
						if (saSaveErr) done(saSaveErr);

						// Get a list of Sas
						agent.get('/sas')
							.end(function(sasGetErr, sasGetRes) {
								// Handle Sa save error
								if (sasGetErr) done(sasGetErr);

								// Get Sas list
								var sas = sasGetRes.body;

								// Set assertions
								(sas[0].user._id).should.equal(userId);
								(sas[0].name).should.match('Sa Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sa instance if not logged in', function(done) {
		agent.post('/sas')
			.send(sa)
			.expect(401)
			.end(function(saSaveErr, saSaveRes) {
				// Call the assertion callback
				done(saSaveErr);
			});
	});

	it('should not be able to save Sa instance if no name is provided', function(done) {
		// Invalidate name field
		sa.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sa
				agent.post('/sas')
					.send(sa)
					.expect(400)
					.end(function(saSaveErr, saSaveRes) {
						// Set message assertion
						(saSaveRes.body.message).should.match('Please fill Sa name');
						
						// Handle Sa save error
						done(saSaveErr);
					});
			});
	});

	it('should be able to update Sa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sa
				agent.post('/sas')
					.send(sa)
					.expect(200)
					.end(function(saSaveErr, saSaveRes) {
						// Handle Sa save error
						if (saSaveErr) done(saSaveErr);

						// Update Sa name
						sa.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sa
						agent.put('/sas/' + saSaveRes.body._id)
							.send(sa)
							.expect(200)
							.end(function(saUpdateErr, saUpdateRes) {
								// Handle Sa update error
								if (saUpdateErr) done(saUpdateErr);

								// Set assertions
								(saUpdateRes.body._id).should.equal(saSaveRes.body._id);
								(saUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sas if not signed in', function(done) {
		// Create new Sa model instance
		var saObj = new Sa(sa);

		// Save the Sa
		saObj.save(function() {
			// Request Sas
			request(app).get('/sas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sa if not signed in', function(done) {
		// Create new Sa model instance
		var saObj = new Sa(sa);

		// Save the Sa
		saObj.save(function() {
			request(app).get('/sas/' + saObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sa.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sa instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sa
				agent.post('/sas')
					.send(sa)
					.expect(200)
					.end(function(saSaveErr, saSaveRes) {
						// Handle Sa save error
						if (saSaveErr) done(saSaveErr);

						// Delete existing Sa
						agent.delete('/sas/' + saSaveRes.body._id)
							.send(sa)
							.expect(200)
							.end(function(saDeleteErr, saDeleteRes) {
								// Handle Sa error error
								if (saDeleteErr) done(saDeleteErr);

								// Set assertions
								(saDeleteRes.body._id).should.equal(saSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sa instance if not signed in', function(done) {
		// Set Sa user 
		sa.user = user;

		// Create new Sa model instance
		var saObj = new Sa(sa);

		// Save the Sa
		saObj.save(function() {
			// Try deleting Sa
			request(app).delete('/sas/' + saObj._id)
			.expect(401)
			.end(function(saDeleteErr, saDeleteRes) {
				// Set message assertion
				(saDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sa error error
				done(saDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sa.remove().exec();
		done();
	});
});