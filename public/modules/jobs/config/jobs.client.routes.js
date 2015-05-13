'use strict';

//Setting up route
angular.module('jobs').config(['$stateProvider',
	function($stateProvider) {
		// Jobs state routing
		$stateProvider.
		state('listJobs', {
			url: '/jobs',
			templateUrl: 'modules/jobs/views/list-jobs.client.view.html'
		}).
		// state('listJobsTel', {
		// 	url: '/jobs/tel',
		// 	templateUrl: 'modules/jobs/views/list-jobs-tel.client.view.html'
		// }).
		state('createJob', {
			url: '/jobs/create',
			templateUrl: 'modules/jobs/views/create-job.client.view.html'
		}).
		state('viewJob', {
			url: '/jobs/:jobId',
			templateUrl: 'modules/jobs/views/view-job.client.view.html'
		}).
		// state('editJobTel', {
		// 	url: '/jobs/:jobId/tel',
		// 	templateUrl: 'modules/jobs/views/view-job-tel.client.view.html'
		// }).
		state('editJob', {
			url: '/jobs/:jobId/edit',
			templateUrl: 'modules/jobs/views/edit-job.client.view.html'
		});
	}
]);