'use strict';

(function() {
	// Technicians Controller Spec
	describe('Technicians Controller Tests', function() {
		// Initialize global variables
		var TechniciansController,
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

			// Initialize the Technicians controller.
			TechniciansController = $controller('TechniciansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Technician object fetched from XHR', inject(function(Technicians) {
			// Create sample Technician using the Technicians service
			var sampleTechnician = new Technicians({
				name: 'New Technician'
			});

			// Create a sample Technicians array that includes the new Technician
			var sampleTechnicians = [sampleTechnician];

			// Set GET response
			$httpBackend.expectGET('technicians').respond(sampleTechnicians);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.technicians).toEqualData(sampleTechnicians);
		}));

		it('$scope.findOne() should create an array with one Technician object fetched from XHR using a technicianId URL parameter', inject(function(Technicians) {
			// Define a sample Technician object
			var sampleTechnician = new Technicians({
				name: 'New Technician'
			});

			// Set the URL parameter
			$stateParams.technicianId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/technicians\/([0-9a-fA-F]{24})$/).respond(sampleTechnician);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.technician).toEqualData(sampleTechnician);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Technicians) {
			// Create a sample Technician object
			var sampleTechnicianPostData = new Technicians({
				name: 'New Technician'
			});

			// Create a sample Technician response
			var sampleTechnicianResponse = new Technicians({
				_id: '525cf20451979dea2c000001',
				name: 'New Technician'
			});

			// Fixture mock form input values
			scope.name = 'New Technician';

			// Set POST response
			$httpBackend.expectPOST('technicians', sampleTechnicianPostData).respond(sampleTechnicianResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Technician was created
			expect($location.path()).toBe('/technicians/' + sampleTechnicianResponse._id);
		}));

		it('$scope.update() should update a valid Technician', inject(function(Technicians) {
			// Define a sample Technician put data
			var sampleTechnicianPutData = new Technicians({
				_id: '525cf20451979dea2c000001',
				name: 'New Technician'
			});

			// Mock Technician in scope
			scope.technician = sampleTechnicianPutData;

			// Set PUT response
			$httpBackend.expectPUT(/technicians\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/technicians/' + sampleTechnicianPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid technicianId and remove the Technician from the scope', inject(function(Technicians) {
			// Create new Technician object
			var sampleTechnician = new Technicians({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Technicians array and include the Technician
			scope.technicians = [sampleTechnician];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/technicians\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTechnician);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.technicians.length).toBe(0);
		}));
	});
}());