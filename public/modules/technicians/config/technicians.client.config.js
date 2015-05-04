'use strict';

// Configuring the Articles module
angular.module('technicians').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Technicians', 'technicians', 'dropdown', '/technicians(/create)?');
		Menus.addSubMenuItem('topbar', 'technicians', 'List Technicians', 'technicians');
		Menus.addSubMenuItem('topbar', 'technicians', 'New Technician', 'technicians/create');
	}
]);