'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Car = mongoose.model('Car'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, car;

/**
 * Car routes tests
 */
describe('Car CRUD tests', function() {
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

		// Save a user to the test db and create new Car
		user.save(function() {
			car = {
				name: 'Car Name'
			};

			done();
		});
	});

	it('should be able to save Car instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car
				agent.post('/cars')
					.send(car)
					.expect(200)
					.end(function(carSaveErr, carSaveRes) {
						// Handle Car save error
						if (carSaveErr) done(carSaveErr);

						// Get a list of Cars
						agent.get('/cars')
							.end(function(carsGetErr, carsGetRes) {
								// Handle Car save error
								if (carsGetErr) done(carsGetErr);

								// Get Cars list
								var cars = carsGetRes.body;

								// Set assertions
								(cars[0].user._id).should.equal(userId);
								(cars[0].name).should.match('Car Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Car instance if not logged in', function(done) {
		agent.post('/cars')
			.send(car)
			.expect(401)
			.end(function(carSaveErr, carSaveRes) {
				// Call the assertion callback
				done(carSaveErr);
			});
	});

	it('should not be able to save Car instance if no name is provided', function(done) {
		// Invalidate name field
		car.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car
				agent.post('/cars')
					.send(car)
					.expect(400)
					.end(function(carSaveErr, carSaveRes) {
						// Set message assertion
						(carSaveRes.body.message).should.match('Please fill Car name');
						
						// Handle Car save error
						done(carSaveErr);
					});
			});
	});

	it('should be able to update Car instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car
				agent.post('/cars')
					.send(car)
					.expect(200)
					.end(function(carSaveErr, carSaveRes) {
						// Handle Car save error
						if (carSaveErr) done(carSaveErr);

						// Update Car name
						car.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Car
						agent.put('/cars/' + carSaveRes.body._id)
							.send(car)
							.expect(200)
							.end(function(carUpdateErr, carUpdateRes) {
								// Handle Car update error
								if (carUpdateErr) done(carUpdateErr);

								// Set assertions
								(carUpdateRes.body._id).should.equal(carSaveRes.body._id);
								(carUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Cars if not signed in', function(done) {
		// Create new Car model instance
		var carObj = new Car(car);

		// Save the Car
		carObj.save(function() {
			// Request Cars
			request(app).get('/cars')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Car if not signed in', function(done) {
		// Create new Car model instance
		var carObj = new Car(car);

		// Save the Car
		carObj.save(function() {
			request(app).get('/cars/' + carObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', car.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Car instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Car
				agent.post('/cars')
					.send(car)
					.expect(200)
					.end(function(carSaveErr, carSaveRes) {
						// Handle Car save error
						if (carSaveErr) done(carSaveErr);

						// Delete existing Car
						agent.delete('/cars/' + carSaveRes.body._id)
							.send(car)
							.expect(200)
							.end(function(carDeleteErr, carDeleteRes) {
								// Handle Car error error
								if (carDeleteErr) done(carDeleteErr);

								// Set assertions
								(carDeleteRes.body._id).should.equal(carSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Car instance if not signed in', function(done) {
		// Set Car user 
		car.user = user;

		// Create new Car model instance
		var carObj = new Car(car);

		// Save the Car
		carObj.save(function() {
			// Try deleting Car
			request(app).delete('/cars/' + carObj._id)
			.expect(401)
			.end(function(carDeleteErr, carDeleteRes) {
				// Set message assertion
				(carDeleteRes.body.message).should.match('User is not logged in');

				// Handle Car error error
				done(carDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Car.remove().exec();
		done();
	});
});