'use strict';

// Technicians controller
angular.module('technicians').controller('TechniciansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Technicians',
	function($scope, $stateParams, $location, Authentication, Technicians) {
		$scope.authentication = Authentication;

		$scope.factoryChoice = [
			{id: 1, name: 'เคาะ'},
			{id: 2, name: 'เตรียมพื้น'},
			{id: 3, name: 'พ่นสี'},
			{id: 4, name: 'ประกอบ'},
			{id: 5, name: 'ขัดสี'},
			{id: 6, name: 'เก็บงาน'},
			{id: 7, name: 'QC'}
		];

		$scope.holidayChoice = [
			{id: 0, name: 'อาทิตย์'},
			{id: 1, name: 'จันทร์'},
			{id: 2, name: 'อังคาร'},
			{id: 3, name: 'พุธ'},
			{id: 4, name: 'พฤหัส'},
			{id: 5, name: 'ศุกร์'},
			{id: 6, name: 'เสาร์'}
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
		
		// For Create
		$scope.tech_skills = [];
		$scope.tech_exholidays = [];
		$scope.addSkillInputC = function(){
			$scope.tech_skills.push({skill_id:''});
		};
		$scope.addExHolidayInputC = function(){
			$scope.tech_exholidays.push({start:new Date(), end:new Date()});
		};
		$scope.removeSkillInputC = function(i){
			$scope.tech_skills.splice(i,1);
		};
		$scope.removeExHolidayInputC = function(i){
			$scope.tech_exholidays.splice(i,1);
		};

		// For Edit
		$scope.addSkillInputE = function(){
			$scope.technician.tech_skills.push({skill_id:''});
		};
		$scope.addExHolidayInputE = function(){
			$scope.techinician.tech_exholidays.push({start:new Date(), end:new Date()});
		};
		$scope.removeSkillInputE = function(i){
			$scope.technician.tech_skills.splice(i,1);
		};
		$scope.removeExHolidayInputE = function(i){
			$scope.technician.tech_exholidays.splice(i,1);
		};

		// Create new Technician
		$scope.create = function() {
			// Create new Technician object
			var technician = new Technicians ({
				tech_id: this.tech_id,
				tech_fullname: this.tech_fullname,
				tech_signdate: this.tech_signdate,
				tech_is_resign: this.tech_is_resign,
				tech_resigndate: this.tech_resigndate,
				tech_holiday: this.tech_holiday,
				tech_main_station: this.tech_main_station,
				tech_skills: this.tech_skills,
				tech_exholidays: this.tech_exholidays
			});

			// Redirect after save
			technician.$save(function(response) {
				$location.path('technicians/' + response._id);

				// Clear form fields
				$scope.tech_id = '';
				$scope.tech_fullname = '';
				$scope.tech_signdate = '';
				$scope.tech_is_resign = false;
				$scope.tech_resigndate = '';
				$scope.tech_holiday = '';
				$scope.tech_main_station = '';
				$scope.tech_skills = [];
				$scope.tech_exholidays = [];


			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Technician
		$scope.remove = function(technician) {
			if ( technician ) { 
				technician.$remove();

				for (var i in $scope.technicians) {
					if ($scope.technicians [i] === technician) {
						$scope.technicians.splice(i, 1);
					}
				}
			} else {
				$scope.technician.$remove(function() {
					$location.path('technicians');
				});
			}
		};

		// Update existing Technician
		$scope.update = function() {
			var technician = $scope.technician;

			technician.$update(function() {
				$location.path('technicians/' + technician._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Technicians
		$scope.find = function() {
			$scope.technicians = Technicians.query();
		};

		// Find existing Technician
		$scope.findOne = function() {
			$scope.technician = Technicians.get({ 
				technicianId: $stateParams.technicianId
			});
		};
	}
]);