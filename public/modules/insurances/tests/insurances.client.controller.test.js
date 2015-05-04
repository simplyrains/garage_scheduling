'use strict';

(function() {
	// Insurances Controller Spec
	describe('Insurances Controller Tests', function() {
		// Initialize global variables
		var InsurancesController,
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

			// Initialize the Insurances controller.
			InsurancesController = $controller('InsurancesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Insurance object fetched from XHR', inject(function(Insurances) {
			// Create sample Insurance using the Insurances service
			var sampleInsurance = new Insurances({
				name: 'New Insurance'
			});

			// Create a sample Insurances array that includes the new Insurance
			var sampleInsurances = [sampleInsurance];

			// Set GET response
			$httpBackend.expectGET('insurances').respond(sampleInsurances);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insurances).toEqualData(sampleInsurances);
		}));

		it('$scope.findOne() should create an array with one Insurance object fetched from XHR using a insuranceId URL parameter', inject(function(Insurances) {
			// Define a sample Insurance object
			var sampleInsurance = new Insurances({
				name: 'New Insurance'
			});

			// Set the URL parameter
			$stateParams.insuranceId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/insurances\/([0-9a-fA-F]{24})$/).respond(sampleInsurance);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.insurance).toEqualData(sampleInsurance);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Insurances) {
			// Create a sample Insurance object
			var sampleInsurancePostData = new Insurances({
				name: 'New Insurance'
			});

			// Create a sample Insurance response
			var sampleInsuranceResponse = new Insurances({
				_id: '525cf20451979dea2c000001',
				name: 'New Insurance'
			});

			// Fixture mock form input values
			scope.name = 'New Insurance';

			// Set POST response
			$httpBackend.expectPOST('insurances', sampleInsurancePostData).respond(sampleInsuranceResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Insurance was created
			expect($location.path()).toBe('/insurances/' + sampleInsuranceResponse._id);
		}));

		it('$scope.update() should update a valid Insurance', inject(function(Insurances) {
			// Define a sample Insurance put data
			var sampleInsurancePutData = new Insurances({
				_id: '525cf20451979dea2c000001',
				name: 'New Insurance'
			});

			// Mock Insurance in scope
			scope.insurance = sampleInsurancePutData;

			// Set PUT response
			$httpBackend.expectPUT(/insurances\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/insurances/' + sampleInsurancePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid insuranceId and remove the Insurance from the scope', inject(function(Insurances) {
			// Create new Insurance object
			var sampleInsurance = new Insurances({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Insurances array and include the Insurance
			scope.insurances = [sampleInsurance];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/insurances\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInsurance);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.insurances.length).toBe(0);
		}));
	});
}());