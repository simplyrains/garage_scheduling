'use strict';

(function() {
	// Jobs Controller Spec
	describe('Jobs Controller Tests', function() {
		// Initialize global variables
		var JobsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Jobs controller.
			JobsController = $controller('JobsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Job object fetched from XHR', inject(function(Jobs) {
			// Create sample Job using the Jobs service
			var sampleJob = new Jobs({
				name: 'New Job'
			});

			// Create a sample Jobs array that includes the new Job
			var sampleJobs = [sampleJob];

			// Set GET response
			$httpBackend.expectGET('jobs').respond(sampleJobs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.jobs).toEqualData(sampleJobs);
		}));

		it('$scope.findOne() should create an array with one Job object fetched from XHR using a jobId URL parameter', inject(function(Jobs) {
			// Define a sample Job object
			var sampleJob = new Jobs({
				name: 'New Job'
			});

			// Set the URL parameter
			$stateParams.jobId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/jobs\/([0-9a-fA-F]{24})$/).respond(sampleJob);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.job).toEqualData(sampleJob);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Jobs) {
			// Create a sample Job object
			var sampleJobPostData = new Jobs({
				name: 'New Job'
			});

			// Create a sample Job response
			var sampleJobResponse = new Jobs({
				_id: '525cf20451979dea2c000001',
				name: 'New Job'
			});

			// Fixture mock form input values
			scope.name = 'New Job';

			// Set POST response
			$httpBackend.expectPOST('jobs', sampleJobPostData).respond(sampleJobResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Job was created
			expect($location.path()).toBe('/jobs/' + sampleJobResponse._id);
		}));

		it('$scope.update() should update a valid Job', inject(function(Jobs) {
			// Define a sample Job put data
			var sampleJobPutData = new Jobs({
				_id: '525cf20451979dea2c000001',
				name: 'New Job'
			});

			// Mock Job in scope
			scope.job = sampleJobPutData;

			// Set PUT response
			$httpBackend.expectPUT(/jobs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/jobs/' + sampleJobPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid jobId and remove the Job from the scope', inject(function(Jobs) {
			// Create new Job object
			var sampleJob = new Jobs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Jobs array and include the Job
			scope.jobs = [sampleJob];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/jobs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleJob);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.jobs.length).toBe(0);
		}));
	});
}());