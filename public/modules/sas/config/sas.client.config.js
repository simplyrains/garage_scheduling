'use strict';

// Configuring the Articles module
angular.module('sas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sas', 'sas', 'dropdown', '/sas(/create)?');
		Menus.addSubMenuItem('topbar', 'sas', 'List Sas', 'sas');
		Menus.addSubMenuItem('topbar', 'sas', 'New Sa', 'sas/create');
	}
]);