'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Job = mongoose.model('Job'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, job;

/**
 * Job routes tests
 */
describe('Job CRUD tests', function() {
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

		// Save a user to the test db and create new Job
		user.save(function() {
			job = {
				name: 'Job Name'
			};

			done();
		});
	});

	it('should be able to save Job instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Job
				agent.post('/jobs')
					.send(job)
					.expect(200)
					.end(function(jobSaveErr, jobSaveRes) {
						// Handle Job save error
						if (jobSaveErr) done(jobSaveErr);

						// Get a list of Jobs
						agent.get('/jobs')
							.end(function(jobsGetErr, jobsGetRes) {
								// Handle Job save error
								if (jobsGetErr) done(jobsGetErr);

								// Get Jobs list
								var jobs = jobsGetRes.body;

								// Set assertions
								(jobs[0].user._id).should.equal(userId);
								(jobs[0].name).should.match('Job Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Job instance if not logged in', function(done) {
		agent.post('/jobs')
			.send(job)
			.expect(401)
			.end(function(jobSaveErr, jobSaveRes) {
				// Call the assertion callback
				done(jobSaveErr);
			});
	});

	it('should not be able to save Job instance if no name is provided', function(done) {
		// Invalidate name field
		job.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Job
				agent.post('/jobs')
					.send(job)
					.expect(400)
					.end(function(jobSaveErr, jobSaveRes) {
						// Set message assertion
						(jobSaveRes.body.message).should.match('Please fill Job name');
						
						// Handle Job save error
						done(jobSaveErr);
					});
			});
	});

	it('should be able to update Job instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Job
				agent.post('/jobs')
					.send(job)
					.expect(200)
					.end(function(jobSaveErr, jobSaveRes) {
						// Handle Job save error
						if (jobSaveErr) done(jobSaveErr);

						// Update Job name
						job.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Job
						agent.put('/jobs/' + jobSaveRes.body._id)
							.send(job)
							.expect(200)
							.end(function(jobUpdateErr, jobUpdateRes) {
								// Handle Job update error
								if (jobUpdateErr) done(jobUpdateErr);

								// Set assertions
								(jobUpdateRes.body._id).should.equal(jobSaveRes.body._id);
								(jobUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Jobs if not signed in', function(done) {
		// Create new Job model instance
		var jobObj = new Job(job);

		// Save the Job
		jobObj.save(function() {
			// Request Jobs
			request(app).get('/jobs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Job if not signed in', function(done) {
		// Create new Job model instance
		var jobObj = new Job(job);

		// Save the Job
		jobObj.save(function() {
			request(app).get('/jobs/' + jobObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', job.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Job instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Job
				agent.post('/jobs')
					.send(job)
					.expect(200)
					.end(function(jobSaveErr, jobSaveRes) {
						// Handle Job save error
						if (jobSaveErr) done(jobSaveErr);

						// Delete existing Job
						agent.delete('/jobs/' + jobSaveRes.body._id)
							.send(job)
							.expect(200)
							.end(function(jobDeleteErr, jobDeleteRes) {
								// Handle Job error error
								if (jobDeleteErr) done(jobDeleteErr);

								// Set assertions
								(jobDeleteRes.body._id).should.equal(jobSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Job instance if not signed in', function(done) {
		// Set Job user 
		job.user = user;

		// Create new Job model instance
		var jobObj = new Job(job);

		// Save the Job
		jobObj.save(function() {
			// Try deleting Job
			request(app).delete('/jobs/' + jobObj._id)
			.expect(401)
			.end(function(jobDeleteErr, jobDeleteRes) {
				// Set message assertion
				(jobDeleteRes.body.message).should.match('User is not logged in');

				// Handle Job error error
				done(jobDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Job.remove().exec();
		done();
	});
});