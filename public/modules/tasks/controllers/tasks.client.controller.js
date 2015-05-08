'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Jobs', 'Technicians',
	function($scope, $stateParams, $location, Authentication, Tasks, Jobs, Technicians) {
		$scope.authentication = Authentication;

		//initial_date = 4th/May/2015
		var initial_date = new Date(2015, 4, 5, 0, 0, 0, 0);
		var current_date = new Date(2015, 4, 6, 0, 0, 0, 0);

		// Create new Task
		$scope.create = function() {
			// Create new Task object
			var task = new Tasks ({
				job: this.job,
				technician: this.technician,
				start_slot: this.start_slot,
				duration: this.duration,
				note: this.note,
				locked: this.locked,
				station: this.station,
				skill_level: this.skill_level
			});
			// Redirect after save
			task.$save(function(response) {
				$location.path('tasks/' + response._id);

				// Clear form fields
				$scope.job = '';
				$scope.technician = '';
				$scope.start_slot = 0;
				$scope.duration = '';
				$scope.note = '';
				$scope.locked = '';
				$scope.station = '';
				$scope.skill_level = '';

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
			Tasks.query().$promise.then(function(result){
				$scope.tasks = result;
				Technicians.query().$promise.then(function(result){
	    			$scope.technicians = result;
	    			$scope.technicians.sort(function(a,b) {
	    				if(a.tech_main_station-b.tech_main_station!==0)
	    					return a.tech_main_station-b.tech_main_station;
	    				return a.tech_id-b.tech_id;
	    			});
	    			return result;
	    		})
	    		.then(function(result){
	    			var n_date = 10;
	    			$scope.table = new Array(16*n_date);
	    			var dateDiff = $scope.getDateDiff(initial_date, current_date);

	    			for(var i=0; i< 16*n_date; i++){
	    				var slot_id = i+ 16*dateDiff;
	    				var this_day = $scope.calc_date(slot_id);
	    				$scope.table[i] = new Array($scope.technicians.length);
	    				for(var j=0, len = $scope.technicians.length; j<len; j++){
	    					$scope.table[i][j] = {
	    						is_holiday: this_day.getDay()===$scope.technicians[j].tech_holiday,
	    						task: null
	    					};
	    				}
	    			}

	    			return result;
	    		}).then(function(result){
		    		var counter = 0;
			    	if($scope.tasks){
						for(var x=0, len = $scope.tasks.length; x<len; x++){
							if($scope.tasks[x].technician !== null){
								$scope.fill_table_ready_task($scope.tasks[x]);
								counter++;
							}
						}
						$scope.status = 'Filled '+counter+' blocks.';
					}
	    		})
	    		;
			});

		};

		// Find existing Task
		$scope.findOne = function() {
			$scope.task = Tasks.get({ 
				taskId: $stateParams.taskId
			});
		};


		$scope.init = function () {

			$scope.row_start = 16*$scope.getDateDiff(initial_date,current_date);

			$scope.status = 'Loading...';
			$scope.slot = [
				{time: '8.00-8.30', id: 0},
				{time: '8.30-9.00', id: 1},
				{time: '9.00-9.30', id: 2},
				{time: '9.30-10.00', id: 3},
				{time: '10.00-10.30', id: 4},
				{time: '10.30-11.00', id: 5},
				{time: '11.00-11.30', id: 6},
				{time: '11.30-12.00', id: 7},
				{time: '13.00-13.30', id: 8},
				{time: '13.30-14.00', id: 9},
				{time: '14.00-14.30', id: 10},
				{time: '14.30-15.00', id: 11},
				{time: '15.00-15.30', id: 12},
				{time: '15.30-16.00', id: 13},
				{time: '16.00-16.30', id: 14},
				{time: '16.30-17.00', id: 15}
			];

			$scope.factoryChoice = [
				{id: 1, name: 'เคาะ'},
				{id: 2, name: 'เตรียมพื้น'},
				{id: 3, name: 'พ่นสี'},
				{id: 4, name: 'ประกอบ'},
				{id: 5, name: 'ขัดสี'},
				{id: 6, name: 'เก็บงาน'},
				{id: 7, name: 'QC'}
			];

			$scope.workTypeChoice = [
				{id: 0, name: 'L1'},
				{id: 1, name: 'L2'},
				{id: 2, name: 'L3'},
				{id: 3, name: 'M1'},
				{id: 4, name: 'M2'},
				{id: 5, name: 'M3'},
				{id: 6, name: 'H1~H3'}
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

		    $scope.jobs = Jobs.query();
		    $scope.technicians = Technicians.query();

		};

		//Helper function
		$scope.getDateDiff = function(date1, date2) {
		    date1.setHours(0, 0, 0, 0);
		    date2.setHours(0, 0, 0, 0);
		    var datediff = (date2.getTime() - date1.getTime()); // difference 
		    return parseInt(datediff / (24 * 60 * 60 * 1000), 10); //Convert values days and return value      
		};
		$scope.calc_date = function(slot_id){
			//year, month, day, hours, minutes, seconds, milliseconds
			var diff = slot_id/16;
			var date = new Date(initial_date.valueOf());
			date.setDate(date.getDate() + diff);
			return date;
		};
		$scope.calc_slot_id = function(t_date, start_slot){
			var diff = $scope.getDateDiff(initial_date, t_date);
			return diff*16+ start_slot;
		};
		$scope.find_tech_index = function(tech_id){
			if(!$scope.technicians) return -99;
			for(var i=0, len = $scope.technicians.length; i<len; i++){
				if($scope.technicians[i].tech_id===tech_id) return i;
			}
			return -1;
		};
		// var get_tech = function(tech__id){
		// 	if(!$scope.technicians) return null;
		// 	for(var i=0, len = $scope.technicians.length; i<len; i++){
		// 		if($scope.technicians[i]._id===tech__id) return $scope.technicians[i];
		// 	}
		// 	return null;
		// };
		$scope.fill_table = function(t_task, tech_id, t_startslot, table){

			var duration = t_task.duration;
			var index_technician = $scope.find_tech_index(tech_id);
			//check if the slot is free, if not we'll return
			//console.log(t_startslot+' '+index_technician);
			var i;			
			for(i = 0; i<duration; i++){
				if($scope.table[t_startslot-$scope.row_start+i][index_technician].is_holiday===true) return false;
				if($scope.table[t_startslot-$scope.row_start+i][index_technician].task!==null) return false;
			}
			//this slot is available
			for(i = 0; i<duration; i++){
				$scope.table[t_startslot-$scope.row_start+i][index_technician].task = t_task;
			}
			return true;
		};
		var check_skill = function(technician, station){
			var tech_skills = technician.tech_skills;
			var max_level = -1;
			for(var i=0, len = tech_skills.length; i<len;i++){
				var skill = tech_skills[i].skill_id;
				//console.log(skill);
				if(skill.length===0) continue;
				if(!skill) continue;
				var res = skill.split('-');
				var res2 = res[1].split('.');				
				var _station = parseInt(res[0]);
				var level = parseInt(res2[1]);
				if(_station===station && level>max_level) max_level = level;
			}
			return max_level;
		};
		var check_free_slot = function(station, skill_level, duration, index_technician, t_startslot){
			//Check if the technician is capable of doing this work
			//console.log('Check skill '+station+' for '+ $scope.technicians[index_technician]);
			var _skill_level = check_skill($scope.technicians[index_technician], station);
			// _skill_level = -1 means no skill
			if(_skill_level === -1) return {possible: false};
			if(station ===1||station===2||station===4){
				if(_skill_level<skill_level) return {possible: false};
			}

			//Check the time he is available
			//check if the slot is free, if not we'll return
			var start=-1;	
			var d = duration;
			//console.log(t_startslot+' x '+$scope.row_start);

			if(t_startslot<$scope.row_start) t_startslot = $scope.row_start;
			var k;
			for(k=0; k<$scope.table.length && d>0; k++){
				console.log(t_startslot-$scope.row_start+k+'/'+index_technician);
				//An occupied slot
				if($scope.table[t_startslot-$scope.row_start+k][index_technician].task!==null){
					d = duration;
					start = -1;
				}
				//Free slot
				else if($scope.table[t_startslot-$scope.row_start+k][index_technician].is_holiday===false){
					if(start<0) start = k;
					d--;
				}
				//Holiday Slot: do nothing
			}
			if(d>0) return {possible: false};
			//console.log('x');
			return {
				possible: true,
				index_technician: index_technician,
				tech_main_station: $scope.technicians[index_technician].tech_main_station,
				skill_level: _skill_level,
				start_slot: t_startslot+start,
				end_slot: t_startslot+k-1
			};
		};
		$scope.fill_table_ready_task = function(t_task){				
			$scope.fill_table(t_task, t_task.technician.tech_id, t_task.start_slot, t_task.duration);
		};
		$scope.display_cell = function(cell){
			if(cell.task===null) return false;
			return true;
		};
		$scope.getBg = function(s){
			var ss = s.substring(s.length-3,s.length);
			var sss = parseInt(ss);
			var a = sss%8;
			var b = sss%50;
			var c = sss/100;
			var color = '#'+(a+8).toString(16)+b.toString()+c.toString()+'AAAA';
			color = color.substring(0,4);
			return color;
		};

		// FUNCTION
		var saveResponseF = function(response) {
					console.log('SAVE > '+response._id);
					console.log(response);
					//response.job = get_tech(response.job);
					//$scope.fill_table_ready_task(response);
				};
		var errorResponseF = function(errorResponse) {
					$scope.error = errorResponse.data.message;
				};
		$scope.addToPlan = function(job){
			job.is_in_plan = true;
			//TODO: check available slot

			var start_slot = $scope.calc_slot_id(new Date(job.start_dt), 0);
			var tasks = [];
			for(var i=0, len=job.approx_hrs.length; i<len; i++){
				var duration = Math.ceil(job.approx_hrs[i].time*2);
				
				//Skip this task if duration==0
				if(duration === 0) continue;

				var results = [];
				for(var j=0, lenn = $scope.technicians.length; j<lenn; j++){
					var result = check_free_slot(
						job.approx_hrs[i].station, 
						job.work_level, 
						duration,
						j, 
						start_slot);
					if(result.possible === true){
						results.push(result);
					}
				}
				if(results.length === 0) return false; //impossible in this time span

				//Choose the best result
				var earliest_slot = results[0].end_slot;

				var point;
				var lowest_point = (results[0].tech_main_station===job.approx_hrs[i].station)? 0 : 1;

				var lowest_skill = results[0].skill_level;
				var chosen_result = results[0];
				for(j = 0, lenn = results.length; j<lenn; j++){
					point = (results[j].tech_main_station===job.approx_hrs[i].station)? 0 : 1;

					if(results[j].end_slot<earliest_slot){
						earliest_slot = results[j].end_slot;
						lowest_skill = results[j].skill_level;
						lowest_point = point;
						chosen_result = results[j];
					}
					else if(results[j].end_slot === earliest_slot){
						if(point < lowest_point){
							earliest_slot = results[j].end_slot;
							lowest_skill = results[j].skill_level;
							lowest_point = point;
							chosen_result = results[j];
						}
						else if(point === lowest_point){
							if(results[j].skill_level < lowest_skill){
								earliest_slot = results[j].end_slot;
								lowest_skill = results[j].skill_level;
								lowest_point = point;
								chosen_result = results[j];
							}
						}
					}
				}
				console.log('Station:'+i+' -> ');
				console.log(chosen_result);
				//Save Task
				// var task = new Tasks ({
				// 	job: job._id,
				// 	technician: $scope.technicians[chosen_result.index_technician]._id,
				// 	start_slot: chosen_result.start_slot,
				// 	duration: duration,
				// 	station: job.approx_hrs[i].station,
				// 	skill_level: job.work_level
				// });

				var task = new Tasks ({
					job: job,
					technician: $scope.technicians[chosen_result.index_technician],
					start_slot: chosen_result.start_slot,
					duration: duration,
					station: job.approx_hrs[i].station,
					skill_level: job.work_level
				});

				start_slot = chosen_result.end_slot+1;

				//Special case: if current station = พ่นสี (3) need to wait 1 hr = 2 slots
				if(job.approx_hrs[i].station === 3) start_slot+=2;
				//Special case: if current station = ขัดสี (5) need to wait 0.5 hr = 1 slot
				else if(job.approx_hrs[i].station === 5) start_slot+=1;

				tasks.push(task);
			}

			//confirm slot: fill
			//technician
			//start_slot
			for(i=0, len=tasks.length; i<len; i++){	
				$scope.fill_table_ready_task(tasks[i]);

				//tasks[i].$save(saveResponseF, errorResponseF);
			}
			return true;
		};

		$scope.init();
	}
]);