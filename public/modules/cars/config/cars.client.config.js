'use strict';

// Configuring the Articles module
angular.module('cars').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Cars', 'cars', 'dropdown', '/cars(/create)?');
		Menus.addSubMenuItem('topbar', 'cars', 'List Cars', 'cars');
		Menus.addSubMenuItem('topbar', 'cars', 'New Car', 'cars/create');
	}
]);