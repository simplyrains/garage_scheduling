'use strict';

// Configuring the Articles module
angular.module('technicians').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Technicians', 'technicians', 'dropdown', '/technicians(/create)?');
		Menus.addSubMenuItem('topbar', 'admin', 'List Technicians', 'technicians');
		Menus.addSubMenuItem('topbar', 'admin', 'New Technician', 'technicians/create');
	}
]);