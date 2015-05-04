'use strict';

//Setting up route
angular.module('sas').config(['$stateProvider',
	function($stateProvider) {
		// Sas state routing
		$stateProvider.
		state('listSas', {
			url: '/sas',
			templateUrl: 'modules/sas/views/list-sas.client.view.html'
		}).
		state('createSa', {
			url: '/sas/create',
			templateUrl: 'modules/sas/views/create-sa.client.view.html'
		}).
		state('viewSa', {
			url: '/sas/:saId',
			templateUrl: 'modules/sas/views/view-sa.client.view.html'
		}).
		state('editSa', {
			url: '/sas/:saId/edit',
			templateUrl: 'modules/sas/views/edit-sa.client.view.html'
		});
	}
]);