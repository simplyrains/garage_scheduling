'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobs','Sas','Cars','Insurances',
	function($scope, $stateParams, $location, Authentication, Jobs, Sas, Cars, Insurances) {
		$scope.authentication = Authentication;

		$scope.sas = Sas.query();
		$scope.cars = Cars.query();
		$scope.insurances = Insurances.query();
		$scope.carTypeChoice = ['ทั่วไป', 'มีรายการซ่อมเพิ่มเติม', 'งานตีกลับภายนอก', 'เอาออกจากแผนชั่วคราว', 'รถไม่จอด', 'ถอดชิ้นส่วนทิ้งไว้'];
		$scope.workTypeChoice = [
			{id: 0, name: 'L1'},
			{id: 1, name: 'L2'},
			{id: 2, name: 'L3'},
			{id: 3, name: 'M1'},
			{id: 4, name: 'M2'},
			{id: 5, name: 'M3'},
			{id: 6, name: 'H1~H3'}
		];
		$scope.approx_hrs = [];
		for(var i=1; i<=7; i++) $scope.approx_hrs.push({
			station: i,
			time: 0
		});

		$scope.factoryChoice = [
			{id: 1, name: 'เคาะ'},
			{id: 2, name: 'เตรียมพื้น'},
			{id: 3, name: 'พ่นสี'},
			{id: 4, name: 'ประกอบ'},
			{id: 5, name: 'ขัดสี'},
			{id: 6, name: 'QC'},
			{id: 7, name: 'เก็บงาน'}
		];

		$scope.is_new_car = true;
		// For Create
		$scope.backorder_parts = [];
		$scope.tel_details = [];
		$scope.car_id = '';
		$scope.get_car_id = function(n){
			for(var i in $scope.cars){
				if($scope.cars[i].name_plate === n){
					return $scope.cars[i]._id;
				}					
				return '';
			}
		};
		$scope.checkcar = function(n){
			console.log(n);
			$scope.car_id = $scope.get_car_id(n);
			if($scope.car_id === ''){
				$scope.is_new_car = true;
				return true;
			}
			$scope.is_new_car = false;
			console.log($scope.car_id);
			return false;
		};
		$scope.calcduedate = function(){
			alert('ระบบยังไม่สามารถคำนวณได้');
		};
		$scope.addBackOrderPartInputC = function(){
			$scope.backorder_parts.push({
				name: '',
				station: 1,
				arrival: new Date()
			});
		};
		$scope.removeBackOrderPartInputC = function(i){
			$scope.backorder_parts.splice(i,1);
		};

		// For Edit
		$scope.addBackOrderPartInputE = function(){
			$scope.job.backorder_parts.push({
				name: '',
				station: 1,
				arrival: new Date()
			});
		};
		$scope.removeBackOrderPartInputE = function(i){
			$scope.job.backorder_parts.splice(i,1);
		};
		$scope.addTelDetailInputE = function(){
			$scope.job.tel_details.push({
				tel_desc: '',
				tel_time: new Date()
			});
		};
		$scope.removeTelDetailInputE = function(i){
			$scope.job.tel_details.splice(i,1);
		};

		// Create new Job
		$scope.create = function() {
			// Create new Job object
			var job = new Jobs ({
				bpj_no: this.bpj_no,
				bpe_no: this.bpe_no,
				start_dt: this.start_dt,
				park_dt: this.park_dt,
				retrieve_dt: this.retrieve_dt,
				sa_id: this.sa_id,
				name_plate: this.name_plate,
				car_type: this.car_type,
				work_level: $scope.calculate_level(this.topserv_hr),
				topserv_hr: this.topserv_hr,
				backorder_parts: this.backorder_parts,
				tel_details: this.tel_details,
				tel_info: this.tel_info,
				approx_hrs: this.approx_hrs
			});
			var car = new Cars ({
				name: this.name,
				customer_name: this.customer_name,
				customer_tel: this.customer_tel,
				insurance: this.insurance,
				name_plate: this.name_plate,
				model_id: this.model_id,
				colour_id: this.colour_id
			});

			// Redirect after save
			console.log('Save Job:');
			console.log(job);
			job.$save(function(response) {
				// Redirect after save
				
				if($scope.is_new_car){
					console.log('Save Car:');
					console.log(car);
					car.$save(function(response) {
						$location.path('jobs/' + response._id);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
				}
				else $location.path('jobs/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.customer_name = '';				
				$scope.customer_tel = '';					
				$scope.insurance = '';				
				$scope.name_plate = '';				
				$scope.model_id = '';			
				$scope.colour_id = '';

				$scope.name = '';
				$scope.bpj_no = '';          // this.bpj_no,
				$scope.bpe_no = '';          // this.bpe_no,
				$scope.start_dt = '';          // this.start_dt,
				$scope.retrieve_dt = '';          // this.retrieve_dt,
				$scope.sa_id = '';          // this.sa_id,
				$scope.name_plate = '';          // this.name_plate,
				$scope.car_type = '';          // this.car_type,
				$scope.topserv_hr = '';          // this.topserv_hr,
				$scope.backorder_parts = [];          // this.backorder_parts,
				$scope.tel_details = [];          // this.tel_details,
				$scope.tel_info = '';          // this.tel_info,
				$scope.approx_hrs = [];          // this.approx_hrs

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Job
		$scope.remove = function(job) {
			if ( job ) { 
				job.$remove();

				for (var i in $scope.jobs) {
					if ($scope.jobs [i] === job) {
						$scope.jobs.splice(i, 1);
					}
				}
			} else {
				$scope.job.$remove(function() {
					$location.path('jobs');
				});
			}
		};

		// Update existing Job
		$scope.update = function() {
			var job = $scope.job;
			job.work_level = $scope.calculate_level(job.topserv_hr);

			job.$update(function() {
				$location.path('tasks');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Jobs
		$scope.find = function() {
			$scope.jobs = Jobs.query();
		};

		// Find existing Job
		$scope.findOne = function() {
			$scope.job = Jobs.get({ 
				jobId: $stateParams.jobId
			});
		};

		// 0 - L1
		// L2
		// L3
		// M1
		// M2
		// M3
		// 6 - H (H1~H3)

		$scope.calculate_level = function(tshr){
			if(tshr<=20) return 0;
			if(tshr<=30) return 1;
			if(tshr<=40) return 2;
			if(tshr<=55) return 3;
			if(tshr<=75) return 4;
			if(tshr<=95) return 5;
			else return 6;
		};
	}
]);