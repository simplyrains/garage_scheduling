'use strict';

// Configuring the Articles module
angular.module('tasks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Controller Menu', 'tasks', 'dropdown', '/tasks(/create)?');
		Menus.addSubMenuItem('topbar', 'tasks', 'จัดตารางงาน', 'tasks');
		//Menus.addSubMenuItem('topbar', 'tasks', 'New Task', 'tasks/create');
	}
]);