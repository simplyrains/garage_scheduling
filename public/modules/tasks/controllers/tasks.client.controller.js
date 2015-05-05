'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Jobs', 'Technicians',
	function($scope, $stateParams, $location, Authentication, Tasks, Jobs, Technicians) {
		$scope.authentication = Authentication;

		$scope.jobs = Jobs.query();
		$scope.technicians = Technicians.query();

		$scope.factoryChoice = [
			{id: 1, name: 'เคาะ'},
			{id: 2, name: 'เตรียมพื้น'},
			{id: 3, name: 'พ่นสี'},
			{id: 4, name: 'ประกอบ'},
			{id: 5, name: 'ขัดสี'},
			{id: 6, name: 'เก็บงาน'},
			{id: 7, name: 'QC'}
		];

		$scope.skillChoice = [
			//MAIN SKILL
				//EXTRA SKILL 										//FACTORY-SKILL.LEVEL
			{factory: 'เคาะ', 			name: 'เคาะ_L1', 			skill_id: '1-A.0' },
			{factory: 'เคาะ', 			name: 'เคาะ_L2', 			skill_id: '1-A.1' },
			{factory: 'เคาะ', 			name: 'เคาะ_L3', 			skill_id: '1-A.2' },
			{factory: 'เคาะ', 			name: 'เคาะ_M1', 			skill_id: '1-A.3' },
			{factory: 'เคาะ', 			name: 'เคาะ_M2', 			skill_id: '1-A.4' },
			{factory: 'เคาะ', 			name: 'เคาะ_M3', 			skill_id: '1-A.5' },
			{factory: 'เคาะ', 			name: 'เคาะ_H', 			skill_id: '1-A.6' },
				{factory: 'เคาะ', 			name: 'เปลี่ยนชุดคานหม้อน้ำ', 	skill_id: '1-B.0' },
				{factory: 'เคาะ', 			name: 'ดัด Chassis', 		skill_id: '1-C.0' },

			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_L1', 		skill_id: '2-A.0' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_L2', 		skill_id: '2-A.1' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_L3', 		skill_id: '2-A.2' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_M1', 		skill_id: '2-A.3' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_M2', 		skill_id: '2-A.4' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_M3', 		skill_id: '2-A.5' },
			{factory: 'เตรียมพื้น', 		name: 'เตรียมพื้น_H', 		skill_id: '2-A.6' },

			{factory: 'พ่นสี', 			name: 'พ่นสี', 				skill_id: '3-A.0' },

			{factory: 'ประกอบ', 		name: 'ประกอบ_L1', 			skill_id: '4-A.0' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_L2', 			skill_id: '4-A.1' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_L3', 			skill_id: '4-A.2' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_M1', 			skill_id: '4-A.3' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_M2', 			skill_id: '4-A.4' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_M3', 			skill_id: '4-A.5' },
			{factory: 'ประกอบ', 		name: 'ประกอบ_H', 			skill_id: '4-A.6' },
				{factory: 'ประกอบ', 		name: 'ประกอบกระจก', 		skill_id: '4-B.0' },
				{factory: 'ประกอบ', 		name: 'ระบบไฟ', 			skill_id: '4-C.0' },
				{factory: 'ประกอบ', 		name: 'ประกอบเครื่องยนต์', 	skill_id: '4-D.0' },
				{factory: 'ประกอบ', 		name: 'เติมน้ำยาแอร์', 		skill_id: '4-E.0' },
				{factory: 'ประกอบ', 		name: 'ใส่ยางรถยนต์', 		skill_id: '4-F.0' },

			{factory: 'ขัดสี', 			name: 'ขัดสี', 				skill_id: '5-A.0' },

			{factory: 'เก็บงาน', 		name: 'เก็บงาน', 			skill_id: '6-A.0' },

			{factory: 'QC', 			name: 'QC', 				skill_id: '7-A.0' }
		];
		
		// Create new Task
		$scope.create = function() {
			// Create new Task object
			var task = new Tasks ({
				bpj_no: this.bpj_no,
				station: this.station,
				tech_id: this.tech_id,
				start_time: this.start_time,
				duration: this.duration,
				note: this.note,
				locked: this.locked,
				skill_requirements: this.skill_requirements
			});
			// Redirect after save
			task.$save(function(response) {
				$location.path('tasks/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.bpj_no = '';
				$scope.station = '';
				$scope.tech_id = '';
				$scope.start_time = '';
				$scope.duration = '';
				$scope.note = '';
				$scope.locked = '';
				$scope.skill_requirements = '';



			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Task
		$scope.remove = function(task) {
			if ( task ) { 
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks [i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}
		};

		// Update existing Task
		$scope.update = function() {
			var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tasks
		$scope.find = function() {
			$scope.tasks = Tasks.query();
		};

		// Find existing Task
		$scope.findOne = function() {
			$scope.task = Tasks.get({ 
				taskId: $stateParams.taskId
			});
		};
	}
]);