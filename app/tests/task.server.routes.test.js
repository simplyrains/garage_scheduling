'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Task = mongoose.model('Task'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, task;

/**
 * Task routes tests
 */
describe('Task CRUD tests', function() {
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

		// Save a user to the test db and create new Task
		user.save(function() {
			task = {
				name: 'Task Name'
			};

			done();
		});
	});

	it('should be able to save Task instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Task
				agent.post('/tasks')
					.send(task)
					.expect(200)
					.end(function(taskSaveErr, taskSaveRes) {
						// Handle Task save error
						if (taskSaveErr) done(taskSaveErr);

						// Get a list of Tasks
						agent.get('/tasks')
							.end(function(tasksGetErr, tasksGetRes) {
								// Handle Task save error
								if (tasksGetErr) done(tasksGetErr);

								// Get Tasks list
								var tasks = tasksGetRes.body;

								// Set assertions
								(tasks[0].user._id).should.equal(userId);
								(tasks[0].name).should.match('Task Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Task instance if not logged in', function(done) {
		agent.post('/tasks')
			.send(task)
			.expect(401)
			.end(function(taskSaveErr, taskSaveRes) {
				// Call the assertion callback
				done(taskSaveErr);
			});
	});

	it('should not be able to save Task instance if no name is provided', function(done) {
		// Invalidate name field
		task.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Task
				agent.post('/tasks')
					.send(task)
					.expect(400)
					.end(function(taskSaveErr, taskSaveRes) {
						// Set message assertion
						(taskSaveRes.body.message).should.match('Please fill Task name');
						
						// Handle Task save error
						done(taskSaveErr);
					});
			});
	});

	it('should be able to update Task instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Task
				agent.post('/tasks')
					.send(task)
					.expect(200)
					.end(function(taskSaveErr, taskSaveRes) {
						// Handle Task save error
						if (taskSaveErr) done(taskSaveErr);

						// Update Task name
						task.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Task
						agent.put('/tasks/' + taskSaveRes.body._id)
							.send(task)
							.expect(200)
							.end(function(taskUpdateErr, taskUpdateRes) {
								// Handle Task update error
								if (taskUpdateErr) done(taskUpdateErr);

								// Set assertions
								(taskUpdateRes.body._id).should.equal(taskSaveRes.body._id);
								(taskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tasks if not signed in', function(done) {
		// Create new Task model instance
		var taskObj = new Task(task);

		// Save the Task
		taskObj.save(function() {
			// Request Tasks
			request(app).get('/tasks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Task if not signed in', function(done) {
		// Create new Task model instance
		var taskObj = new Task(task);

		// Save the Task
		taskObj.save(function() {
			request(app).get('/tasks/' + taskObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', task.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Task instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Task
				agent.post('/tasks')
					.send(task)
					.expect(200)
					.end(function(taskSaveErr, taskSaveRes) {
						// Handle Task save error
						if (taskSaveErr) done(taskSaveErr);

						// Delete existing Task
						agent.delete('/tasks/' + taskSaveRes.body._id)
							.send(task)
							.expect(200)
							.end(function(taskDeleteErr, taskDeleteRes) {
								// Handle Task error error
								if (taskDeleteErr) done(taskDeleteErr);

								// Set assertions
								(taskDeleteRes.body._id).should.equal(taskSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Task instance if not signed in', function(done) {
		// Set Task user 
		task.user = user;

		// Create new Task model instance
		var taskObj = new Task(task);

		// Save the Task
		taskObj.save(function() {
			// Try deleting Task
			request(app).delete('/tasks/' + taskObj._id)
			.expect(401)
			.end(function(taskDeleteErr, taskDeleteRes) {
				// Set message assertion
				(taskDeleteRes.body.message).should.match('User is not logged in');

				// Handle Task error error
				done(taskDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Task.remove().exec();
		done();
	});
});