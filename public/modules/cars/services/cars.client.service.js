'use strict';

//Cars service used to communicate Cars REST endpoints
angular.module('cars').factory('Cars', ['$resource',
	function($resource) {
		return $resource('cars/:carId', { carId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);