'use strict';

// Cars controller
angular.module('cars').controller('CarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cars', 'Insurances',
	function($scope, $stateParams, $location, Authentication, Cars, Insurances) {
		$scope.authentication = Authentication;

		$scope.insurances = Insurances.query();

		// Create new Car
		$scope.create = function() {
			// Create new Car object
			var car = new Cars ({
				name: this.name,
				customer_name: this.customer_name,
				customer_tel: this.customer_tel,
				insurance: this.insurance,
				name_plate: this.name_plate,
				model_id: this.model_id,
				colour_id: this.colour_id
			});

			// Redirect after save
			car.$save(function(response) {
				$location.path('cars');

				// Clear form fields
				$scope.name = '';
				$scope.customer_name = '';				
				$scope.customer_tel = '';					
				$scope.insurance = '';				
				$scope.name_plate = '';				
				$scope.model_id = '';			
				$scope.colour_id = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Car
		$scope.remove = function(car) {
			if ( car ) { 
				car.$remove();

				for (var i in $scope.cars) {
					if ($scope.cars [i] === car) {
						$scope.cars.splice(i, 1);
					}
				}
			} else {
				$scope.car.$remove(function() {
					$location.path('cars');
				});
			}
		};

		// Update existing Car
		$scope.update = function() {
			var car = $scope.car;

			car.$update(function() {
				$location.path('cars/' + car._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Cars
		$scope.find = function() {
			$scope.cars = Cars.query();
		};

		// Find existing Car
		$scope.findOne = function() {
			$scope.car = Cars.get({ 
				carId: $stateParams.carId
			});
		};
	}
]);