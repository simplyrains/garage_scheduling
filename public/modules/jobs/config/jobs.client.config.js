'use strict';

// Configuring the Articles module
angular.module('jobs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'SA Menu', 'jobs', 'dropdown', '/jobs(/create)?');
		Menus.addSubMenuItem('topbar', 'jobs', 'ติดตามสถานะรถ', 'jobs');
		Menus.addSubMenuItem('topbar', 'jobs', 'กรอกข้อมูลใบจ้อบ', 'jobs/create');
		Menus.addSubMenuItem('topbar', 'jobs', 'โทรติดต่อลูกค้า', 'jobs/tel');		
	}
]);