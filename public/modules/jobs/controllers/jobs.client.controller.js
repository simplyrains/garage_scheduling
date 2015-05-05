'use strict';

// Jobs controller
angular.module('jobs').controller('JobsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Jobs','Sas','Cars',
	function($scope, $stateParams, $location, Authentication, Jobs, Sas, Cars) {
		$scope.authentication = Authentication;

		$scope.sas = Sas.query();
		$scope.cars = Cars.query();
		$scope.carTypeChoice = ['ทั่วไป', 'มีรายการซ่อมเพิ่มเติม', 'งานตีกลับภายนอก', 'เอาออกจากแผนชั่วคราว', 'รถไม่จอด', 'ถอดชิ้นส่วนทิ้งไว้'];
		$scope.workTypeChoice = ['L','M','H'];

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

		// For Create
		$scope.backorder_parts = [];
		$scope.tel_details = [];
		$scope.addBackOrderPartInputC = function(){
			$scope.backorder_parts.push({
				name: '',
				station: 1,
				arrival: new Date()
			});
		};
		$scope.addTelDetailInputC = function(){
			$scope.tel_details.push({
				tel_desc: '',
				tel_time: new Date()
			});
		};

		// For Edit
		$scope.addBackOrderPartInputE = function(){
			$scope.job.backorder_parts.push({
				name: '',
				station: 1,
				arrival: new Date()
			});
		};
		$scope.addTelDetailInputE = function(){
			$scope.job.tel_details.push({
				tel_desc: '',
				tel_time: new Date()
			});
		};

		// Create new Job
		$scope.create = function() {
			// Create new Job object
			var job = new Jobs ({
				bpj_no: this.bpj_no,
				bpe_no: this.bpe_no,
				start_dt: this.start_dt,
				retrieve_dt: this.retrieve_dt,
				sa_id: this.sa_id,
				name_plate: this.name_plate,
				car_type: this.car_type,
				work_type: this.work_type,
				topserv_hr: this.topserv_hr,
				backorder_parts: this.backorder_parts,
				tel_details: this.tel_details,
				tel_info: this.tel_info,
				approx_hrs: this.approx_hrs
			});

			// Redirect after save
			job.$save(function(response) {
				$location.path('jobs/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.bpj_no = '';          // this.bpj_no,
				$scope.bpe_no = '';          // this.bpe_no,
				$scope.start_dt = '';          // this.start_dt,
				$scope.retrieve_dt = '';          // this.retrieve_dt,
				$scope.sa_id = '';          // this.sa_id,
				$scope.name_plate = '';          // this.name_plate,
				$scope.car_type = '';          // this.car_type,
				$scope.work_type = '';          // this.work_type,
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

			job.$update(function() {
				$location.path('jobs/' + job._id);
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
	}
]);