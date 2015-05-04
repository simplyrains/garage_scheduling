'use strict';

//Sas service used to communicate Sas REST endpoints
angular.module('sas').factory('Sas', ['$resource',
	function($resource) {
		return $resource('sas/:saId', { saId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);