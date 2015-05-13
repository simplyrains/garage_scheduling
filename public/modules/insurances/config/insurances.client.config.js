'use strict';

// Configuring the Articles module
angular.module('insurances').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Insurances', 'insurances', 'dropdown', '/insurances(/create)?');
		Menus.addSubMenuItem('topbar', 'admin', 'List Insurances', 'insurances');
		Menus.addSubMenuItem('topbar', 'admin', 'New Insurance', 'insurances/create');
	}
]);