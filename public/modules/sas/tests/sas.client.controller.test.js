'use strict';

(function() {
	// Sas Controller Spec
	describe('Sas Controller Tests', function() {
		// Initialize global variables
		var SasController,
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

			// Initialize the Sas controller.
			SasController = $controller('SasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sa object fetched from XHR', inject(function(Sas) {
			// Create sample Sa using the Sas service
			var sampleSa = new Sas({
				name: 'New Sa'
			});

			// Create a sample Sas array that includes the new Sa
			var sampleSas = [sampleSa];

			// Set GET response
			$httpBackend.expectGET('sas').respond(sampleSas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sas).toEqualData(sampleSas);
		}));

		it('$scope.findOne() should create an array with one Sa object fetched from XHR using a saId URL parameter', inject(function(Sas) {
			// Define a sample Sa object
			var sampleSa = new Sas({
				name: 'New Sa'
			});

			// Set the URL parameter
			$stateParams.saId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sas\/([0-9a-fA-F]{24})$/).respond(sampleSa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sa).toEqualData(sampleSa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sas) {
			// Create a sample Sa object
			var sampleSaPostData = new Sas({
				name: 'New Sa'
			});

			// Create a sample Sa response
			var sampleSaResponse = new Sas({
				_id: '525cf20451979dea2c000001',
				name: 'New Sa'
			});

			// Fixture mock form input values
			scope.name = 'New Sa';

			// Set POST response
			$httpBackend.expectPOST('sas', sampleSaPostData).respond(sampleSaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sa was created
			expect($location.path()).toBe('/sas/' + sampleSaResponse._id);
		}));

		it('$scope.update() should update a valid Sa', inject(function(Sas) {
			// Define a sample Sa put data
			var sampleSaPutData = new Sas({
				_id: '525cf20451979dea2c000001',
				name: 'New Sa'
			});

			// Mock Sa in scope
			scope.sa = sampleSaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sas/' + sampleSaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid saId and remove the Sa from the scope', inject(function(Sas) {
			// Create new Sa object
			var sampleSa = new Sas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sas array and include the Sa
			scope.sas = [sampleSa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sas.length).toBe(0);
		}));
	});
}());