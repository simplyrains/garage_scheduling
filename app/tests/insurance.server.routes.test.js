'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Insurance = mongoose.model('Insurance'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, insurance;

/**
 * Insurance routes tests
 */
describe('Insurance CRUD tests', function() {
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

		// Save a user to the test db and create new Insurance
		user.save(function() {
			insurance = {
				name: 'Insurance Name'
			};

			done();
		});
	});

	it('should be able to save Insurance instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insurance
				agent.post('/insurances')
					.send(insurance)
					.expect(200)
					.end(function(insuranceSaveErr, insuranceSaveRes) {
						// Handle Insurance save error
						if (insuranceSaveErr) done(insuranceSaveErr);

						// Get a list of Insurances
						agent.get('/insurances')
							.end(function(insurancesGetErr, insurancesGetRes) {
								// Handle Insurance save error
								if (insurancesGetErr) done(insurancesGetErr);

								// Get Insurances list
								var insurances = insurancesGetRes.body;

								// Set assertions
								(insurances[0].user._id).should.equal(userId);
								(insurances[0].name).should.match('Insurance Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Insurance instance if not logged in', function(done) {
		agent.post('/insurances')
			.send(insurance)
			.expect(401)
			.end(function(insuranceSaveErr, insuranceSaveRes) {
				// Call the assertion callback
				done(insuranceSaveErr);
			});
	});

	it('should not be able to save Insurance instance if no name is provided', function(done) {
		// Invalidate name field
		insurance.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insurance
				agent.post('/insurances')
					.send(insurance)
					.expect(400)
					.end(function(insuranceSaveErr, insuranceSaveRes) {
						// Set message assertion
						(insuranceSaveRes.body.message).should.match('Please fill Insurance name');
						
						// Handle Insurance save error
						done(insuranceSaveErr);
					});
			});
	});

	it('should be able to update Insurance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insurance
				agent.post('/insurances')
					.send(insurance)
					.expect(200)
					.end(function(insuranceSaveErr, insuranceSaveRes) {
						// Handle Insurance save error
						if (insuranceSaveErr) done(insuranceSaveErr);

						// Update Insurance name
						insurance.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Insurance
						agent.put('/insurances/' + insuranceSaveRes.body._id)
							.send(insurance)
							.expect(200)
							.end(function(insuranceUpdateErr, insuranceUpdateRes) {
								// Handle Insurance update error
								if (insuranceUpdateErr) done(insuranceUpdateErr);

								// Set assertions
								(insuranceUpdateRes.body._id).should.equal(insuranceSaveRes.body._id);
								(insuranceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Insurances if not signed in', function(done) {
		// Create new Insurance model instance
		var insuranceObj = new Insurance(insurance);

		// Save the Insurance
		insuranceObj.save(function() {
			// Request Insurances
			request(app).get('/insurances')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Insurance if not signed in', function(done) {
		// Create new Insurance model instance
		var insuranceObj = new Insurance(insurance);

		// Save the Insurance
		insuranceObj.save(function() {
			request(app).get('/insurances/' + insuranceObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', insurance.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Insurance instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Insurance
				agent.post('/insurances')
					.send(insurance)
					.expect(200)
					.end(function(insuranceSaveErr, insuranceSaveRes) {
						// Handle Insurance save error
						if (insuranceSaveErr) done(insuranceSaveErr);

						// Delete existing Insurance
						agent.delete('/insurances/' + insuranceSaveRes.body._id)
							.send(insurance)
							.expect(200)
							.end(function(insuranceDeleteErr, insuranceDeleteRes) {
								// Handle Insurance error error
								if (insuranceDeleteErr) done(insuranceDeleteErr);

								// Set assertions
								(insuranceDeleteRes.body._id).should.equal(insuranceSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Insurance instance if not signed in', function(done) {
		// Set Insurance user 
		insurance.user = user;

		// Create new Insurance model instance
		var insuranceObj = new Insurance(insurance);

		// Save the Insurance
		insuranceObj.save(function() {
			// Try deleting Insurance
			request(app).delete('/insurances/' + insuranceObj._id)
			.expect(401)
			.end(function(insuranceDeleteErr, insuranceDeleteRes) {
				// Set message assertion
				(insuranceDeleteRes.body.message).should.match('User is not logged in');

				// Handle Insurance error error
				done(insuranceDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Insurance.remove().exec();
		done();
	});
});