'use strict';

// Insurances controller
angular.module('insurances').controller('InsurancesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Insurances',
	function($scope, $stateParams, $location, Authentication, Insurances) {
		$scope.authentication = Authentication;

		// Create new Insurance
		$scope.create = function() {
			// Create new Insurance object
			var insurance = new Insurances ({
				insurance_name: this.insurance_name,
				insurance_tell: this.insurance_tel
			});

			// Redirect after save
			insurance.$save(function(response) {
				$location.path('insurances/' + response._id);

				// Clear form fields
				$scope.insurance_name = '';
				%scope.insurance_tel = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Insurance
		$scope.remove = function(insurance) {
			if ( insurance ) { 
				insurance.$remove();

				for (var i in $scope.insurances) {
					if ($scope.insurances [i] === insurance) {
						$scope.insurances.splice(i, 1);
					}
				}
			} else {
				$scope.insurance.$remove(function() {
					$location.path('insurances');
				});
			}
		};

		// Update existing Insurance
		$scope.update = function() {
			var insurance = $scope.insurance;

			insurance.$update(function() {
				$location.path('insurances/' + insurance._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Insurances
		$scope.find = function() {
			$scope.insurances = Insurances.query();
		};

		// Find existing Insurance
		$scope.findOne = function() {
			$scope.insurance = Insurances.get({ 
				insuranceId: $stateParams.insuranceId
			});
		};
	}
]);