'use strict';

//Technicians service used to communicate Technicians REST endpoints
angular.module('technicians').factory('Technicians', ['$resource',
	function($resource) {
		return $resource('technicians/:technicianId', { technicianId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);