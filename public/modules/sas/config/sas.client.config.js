'use strict';

// Configuring the Articles module
angular.module('sas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Sas', 'sas', 'dropdown', '/sas(/create)?');
		Menus.addSubMenuItem('topbar', 'admin', 'List SA', 'sas');
		Menus.addSubMenuItem('topbar', 'admin', 'New SA', 'sas/create');
	}
]);