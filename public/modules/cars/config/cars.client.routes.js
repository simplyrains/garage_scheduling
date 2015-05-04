'use strict';

//Setting up route
angular.module('cars').config(['$stateProvider',
	function($stateProvider) {
		// Cars state routing
		$stateProvider.
		state('listCars', {
			url: '/cars',
			templateUrl: 'modules/cars/views/list-cars.client.view.html'
		}).
		state('createCar', {
			url: '/cars/create',
			templateUrl: 'modules/cars/views/create-car.client.view.html'
		}).
		state('viewCar', {
			url: '/cars/:carId',
			templateUrl: 'modules/cars/views/view-car.client.view.html'
		}).
		state('editCar', {
			url: '/cars/:carId/edit',
			templateUrl: 'modules/cars/views/edit-car.client.view.html'
		});
	}
]);