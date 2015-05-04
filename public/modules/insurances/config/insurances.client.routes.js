'use strict';

//Setting up route
angular.module('insurances').config(['$stateProvider',
	function($stateProvider) {
		// Insurances state routing
		$stateProvider.
		state('listInsurances', {
			url: '/insurances',
			templateUrl: 'modules/insurances/views/list-insurances.client.view.html'
		}).
		state('createInsurance', {
			url: '/insurances/create',
			templateUrl: 'modules/insurances/views/create-insurance.client.view.html'
		}).
		state('viewInsurance', {
			url: '/insurances/:insuranceId',
			templateUrl: 'modules/insurances/views/view-insurance.client.view.html'
		}).
		state('editInsurance', {
			url: '/insurances/:insuranceId/edit',
			templateUrl: 'modules/insurances/views/edit-insurance.client.view.html'
		});
	}
]);