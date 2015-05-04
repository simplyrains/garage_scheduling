'use strict';

//Insurances service used to communicate Insurances REST endpoints
angular.module('insurances').factory('Insurances', ['$resource',
	function($resource) {
		return $resource('insurances/:insuranceId', { insuranceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);