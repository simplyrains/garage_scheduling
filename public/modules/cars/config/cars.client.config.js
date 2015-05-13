'use strict';

// Configuring the Articles module
angular.module('cars').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Admin Menu', 'admin', 'dropdown', '/');
		Menus.addSubMenuItem('topbar', 'admin', 'List Cars', 'cars');
		Menus.addSubMenuItem('topbar', 'admin', 'New Car', 'cars/create');
	}
]);