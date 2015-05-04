'use strict';

//Setting up route
angular.module('technicians').config(['$stateProvider',
	function($stateProvider) {
		// Technicians state routing
		$stateProvider.
		state('listTechnicians', {
			url: '/technicians',
			templateUrl: 'modules/technicians/views/list-technicians.client.view.html'
		}).
		state('createTechnician', {
			url: '/technicians/create',
			templateUrl: 'modules/technicians/views/create-technician.client.view.html'
		}).
		state('viewTechnician', {
			url: '/technicians/:technicianId',
			templateUrl: 'modules/technicians/views/view-technician.client.view.html'
		}).
		state('editTechnician', {
			url: '/technicians/:technicianId/edit',
			templateUrl: 'modules/technicians/views/edit-technician.client.view.html'
		});
	}
]);