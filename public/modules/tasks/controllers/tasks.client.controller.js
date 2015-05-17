'use strict';


// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', 
	'$location', 'Authentication', 'Tasks', 'Jobs', 'Technicians',
	function($scope, $stateParams, $location, Authentication, Tasks, Jobs, Technicians) {
		$scope.authentication = Authentication;

		//initial_date = 4th/May/2015
		var initial_date = new Date(2015, 5, 1, 0, 0, 0, 0);
		var current_date = new Date(2015, 5, 2, 0, 0, 0, 0);

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
				skill_level: this.skill_level,
				is_in_plan: this.is_in_plan
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
				$scope.is_in_plan = false;

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
	    			var n_date = 120;
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
								$scope.fill_table($scope.tasks[x]);
								counter++;
							}
						}
						$scope.status = '-> complete!';
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
		    $scope.current_jobs = [];
		    $scope.current_tasks = [];
		    $scope.show_edit = false;
		    $scope.chosen_slot = $scope.row_start-1;
		};

		//Helper function
		$scope.totalLate = function(){
			var late = 0;
			for(var i in $scope.current_jobs){
				late+=$scope.calc_late($scope.current_jobs[i]);
			}
			return late;
		};
		$scope.getDateDiff = function(date1, date2) {
		    date1.setHours(0, 0, 0, 0);
		    date2.setHours(0, 0, 0, 0);
		    var datediff = (date2.getTime() - date1.getTime()); // difference 
		    return parseInt(datediff / (24 * 60 * 60 * 1000), 10); //Convert values days and return value      
		};
		$scope.job_order_func = function(job){
			var start_dt = $scope.getDateDiff(initial_date, new Date(job.start_dt));			
			var retrieve_dt = $scope.getDateDiff(initial_date, new Date(job.retrieve_dt));
			var work_level = job.work_level;
			if(work_level === 0) work_level = 2;
			else if(work_level === 2) work_level = 0;
			else if(work_level === 3) work_level = 5;
			else if(work_level === 5) work_level = 3;
			var total_time = 0;
			for(var i in job.approx_hrs){
				total_time+=job.approx_hrs[i].time;
			}
			return start_dt*1000000000+retrieve_dt*1000000+work_level*100000+total_time;
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
		$scope.get_skill_desc = function(skill_id){

			for (var k in $scope.skillChoice) {
				if ($scope.skillChoice[k].skill_id === skill_id) {
					if($scope.skillChoice[k].skill_id.substring(2,3)!=='A') return '';
					else return $scope.skillChoice[k].name;
				}
			}	
		};
		$scope.fill_table = function(task){
			console.log(task);
			var station = task.station;
			var duration = task.duration;
			var index_technician = $scope.find_tech_index(task.technician.tech_id);
			var start_slot = task.start_slot;
			var end_slot = task.end_slot;
			var d = duration;
			var k;
			for(k=start_slot; k<=end_slot; k++){
				if($scope.table[k-$scope.row_start][index_technician].is_holiday===false){
					$scope.table[k-$scope.row_start][index_technician].task = task;
				}
			}
		};
		var unfill_table = function(task){
			var station = task.station;
			var duration = task.duration;
			var index_technician = $scope.find_tech_index(task.technician.tech_id);
			var start_slot = task.start_slot;
			var end_slot = task.end_slot;
			var d = duration;
			var k;
			for(k=start_slot; k<=end_slot; k++){
				if($scope.table[k-$scope.row_start][index_technician].is_holiday===false){
					$scope.table[k-$scope.row_start][index_technician].task = null;
				}
			}
		};
		var check_skill = function(technician, station){
			if(!technician.tech_skills) return -1;
			var tech_skills = technician.tech_skills;
			var max_level = -1;
			for(var i=0, len = tech_skills.length; i<len;i++){
				var skill = tech_skills[i].skill_id;
			
				if(skill.length===0) continue;
				if(!skill) continue;
				var res = skill.split('-');
				var res2 = res[1].split('.');				
				var _station = parseInt(res[0]);
				var level = parseInt(res2[1]);
				if(_station===station && level>max_level) max_level = level;
			}

			if(station ===1||station===2||station===4){
				return max_level;
			}
			//these station require no skill level
			else if(max_level>=0){
				return 99;
			}
			//no skill for this station
			return -1;
		};
		var calc_start_time = function(task){
			var start_slot;
			if(!task.prerequisite){
				start_slot = $scope.calc_slot_id(new Date(task.job.start_dt), 0);
				if(start_slot<=$scope.chosen_slot) start_slot = $scope.chosen_slot+1;
				return start_slot;
			}
			start_slot = task.prerequisite.end_slot+1;
			//Special case: if previous station = พ่นสี (3) need to wait 1 hr = 2 slots
			if(task.prerequisite.station === 3) start_slot+=2;
			//Special case: if previous station = ขัดสี (5) need to wait 0.5 hr = 1 slot
			else if(task.prerequisite.station === 5) start_slot+=1;
			return start_slot;
		};
		var check_free_slot = function(station, skill_level, duration, index_technician, t_startslot){
			//Check if the technician is capable of doing this work
		
			var _skill_level = check_skill($scope.technicians[index_technician], station);
			// _skill_level = -1 means no skill
			if(_skill_level === -1) return {possible: false};
			else if(_skill_level<skill_level) return {possible: false};

			//Check the time he is available
			//check if the slot is free, if not we'll return
			var start=-1;	
			var d = duration;

			if(t_startslot<=$scope.chosen_slot) t_startslot = $scope.chosen_slot+1;
			var k = t_startslot;
			for(; k-$scope.row_start<$scope.table.length && d>0; k++){

				//An occupied slot
				if($scope.table[k-$scope.row_start][index_technician].task!==null){
					d = duration;
					start = -1;
				}
				//Free slot
				else if($scope.table[k-$scope.row_start][index_technician].is_holiday===false){
					if(start<0) start = k;
					d--;
				}
				//Holiday Slot: do nothing
			}
			if(d>0) return {possible: false};
		
			return {
				possible: true,
				index_technician: index_technician,
				tech_main_station: $scope.technicians[index_technician].tech_main_station,
				skill_level: _skill_level,
				start_slot: start,
				end_slot: k-1
			};
		};
		$scope.display_cell = function(cell){
			if(cell.task===null) return false;
			return true;
		};
		$scope.calc_late = function(job){
			return $scope.getDateDiff(
				new Date(job.retrieve_dt),
				new Date(job.complete_dt)
			);
		};
		$scope.movePriorityUp = function(index){
			if(index === 0) return;
			var temp;
			temp = $scope.current_jobs[index];
			$scope.current_jobs[index] = $scope.current_jobs[index-1];
			$scope.current_jobs[index-1] = temp;
		};
		$scope.movePriorityDown = function(index){
			if(index+1 === $scope.current_jobs.length) return;
			var temp;
			temp = $scope.current_jobs[index];
			$scope.current_jobs[index] = $scope.current_jobs[index+1];
			$scope.current_jobs[index+1] = temp;
		};
		//UNTESTED FUNCTION
		var getPriority = function(job) {
			for (var i in $scope.current_jobs) {
				if ($scope.current_jobs[i].bpj_no === job.bpj_no) {
					return i;
				}
			}	
			return -1;
		};
		$scope.remove_after = function(chosen_slot){

			for(var i=0, len = $scope.table.length; i<len; i++){
				var slot_id = i+$scope.row_start;
				for(var j=0, lenn = $scope.technicians.length; j<lenn; j++){
					if($scope.table[i][j].is_holiday) continue;
					if($scope.table[i][j].task){
						var task = $scope.table[i][j].task;
						if(task.locked) continue;
						if(task.start_slot > chosen_slot){
							task.is_in_plan =false;
							$scope.table[i][j].task = null;
						}
					}
				}
			}

		};
		$scope.put_in_plan = function(){
			var tasks_with_priority = [];

			for (var i in $scope.current_tasks) {
				var task = $scope.current_tasks[i];
				var priority = getPriority(task.job)*10 + task.station;
				if(task.is_in_plan) continue;				
				if(task.locked) continue;
				tasks_with_priority.push({
					task: task,
					priority: priority
				});
			}	
			tasks_with_priority.sort(function(a,b) {
				return a.priority-b.priority;
			});
			for(var j=0, len=tasks_with_priority.length; j<len; j++){
				if(!add_task_to_plan(tasks_with_priority[j].task)){
					$scope.remove_job(tasks_with_priority[j].task.job);
					return false;
				}
			}
			return true;
		};
		var add_task_to_plan = function(task){

			var start_slot = calc_start_time(task);

			var results = [];

			//check_free_slot = function(station, skill_level, duration,
			//index_technician, t_startslot){

			for(var j=0, lenn = $scope.technicians.length; j<lenn; j++){
				var result = check_free_slot(
					task.station, 
					task.skill_level, 
					task.duration,
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
			var lowest_point = (results[0].tech_main_station===task.station)? 0 : 1;

			var lowest_skill = results[0].skill_level;
			var chosen_result = results[0];
			for(j = 0, lenn = results.length; j<lenn; j++){
				point = (results[j].tech_main_station===task.station)? 0 : 1;

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
			task.technician = $scope.technicians[chosen_result.index_technician];
			task.start_slot = chosen_result.start_slot;
			task.end_slot = chosen_result.end_slot;
			task.is_in_plan = true;
			
			//Update job complete time
			if(task.station === 7){
				task.job.complete_dt = $scope.calc_date(task.end_slot);
			}

			//fill the table
			$scope.fill_table(task);

			return true;
		};
		$scope.addToPlan = function(job){
			//move job to current_jobs
			for (var k in $scope.jobs) {
				if ($scope.jobs [k] === job) {
					$scope.jobs.splice(k, 1);
				}
			}	

			//random color
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * 16)];
		    }
			job.color = color;
			$scope.current_jobs.push(job);


			//TODO: check available slot from start date, right now it's now :P
			var prev_task = null;
			for(var current_station=0; current_station<job.approx_hrs.length; current_station++){
				var duration = Math.ceil(job.approx_hrs[current_station].time*2);

				//Skip this task if duration==0
				if(duration === 0) continue;

				var task = new Tasks ({
					job: job,
					duration: duration,
					station: job.approx_hrs[current_station].station,
					skill_level: job.work_level,
					is_in_plan: false,
					//frontend_only
					prerequisite: prev_task,
					next_task: null
				});
				if(task.prerequisite) task.prerequisite.next_task = task;
				//will returns a slot that the filled task is complete
				if(!add_task_to_plan(task)){
					alert('error: ใส่งาน '+task.job.bpj_no+'/'+task.station+' ลง plan ไม่ได้');
					$scope.remove_job(task.job);
					return false;
				}

				prev_task = task;
				$scope.current_tasks.push(task);
			}
			return true;
		};
		$scope.edit_task = function(task){
			console.log(task);
			$scope.show_edit = false;
			$scope.show_edit_freeze = false;

			if(task.end_slot<$scope.chosen_slot){
				alert('งานจบไปแล้ว');
			}
			if($scope.is_freeze(task)){				
				$scope.show_edit_freeze = true;
			}
			else{
				$scope.show_edit = true;
			}
			var possible_tech = [];
			for(var i in $scope.technicians){
				var technician = $scope.technicians[i];
				var level = check_skill(technician,task.station);
				var required = task.skill_level;
				if(level>=required) possible_tech.push(technician);
			}
			$scope.selected_task = {
				technician: task.technician,
				start_slot: task.start_slot,
				duration: task.duration,
				note: task.note,
				skill_level: task.skill_level,
				earliest_start_time: calc_start_time(task),
				ref_task: task,
				technicians: possible_tech
			};
		};
		var lock_task = function(task){
			var t = task;
			while(t!==null){
				t.locked =true;
				t = t.prerequisite;
			}		
		};
		$scope.is_freeze = function(task){
			if(task.start_slot <= $scope.chosen_slot) return true;
			return false;
		};
		$scope.unlock_task = function(task){
			var t = task;
			while(t!==null){
				t.locked =false;
				t = t.next_task;
			}		
		};
		$scope.remove_job = function(job){

			for (var i = $scope.current_tasks.length-1; i>=0; i--) {
				var task = $scope.current_tasks[i];
				if(task.job._id === job._id){
					console.log('Remove Task');
					console.log(task);
					unfill_table(task);
					$scope.current_tasks.splice(i,1);
				}
			}	
			for (i in $scope.current_jobs) {
				var _job = $scope.current_jobs[i];
				if(job._id === _job._id){					
					console.log('Remove Job');
					console.log(_job);
					$scope.current_jobs.splice(i,1);
				}
			}	
			alert('ยกเลิก Job : '+job.bpj_no);
			$scope.jobs.push(job);
		};
		$scope.save_edit_task = function(){
			if(!$scope.is_freeze($scope.selected_task.ref_task)){
				if(parseInt($scope.selected_task.start_slot) < $scope.selected_task.earliest_start_time){
					alert('กรอกเวลาผิด');
					return;
				}
				if(parseInt($scope.selected_task.start_slot)+parseInt($scope.selected_task.duration)-1 < $scope.chosen_slot){
					alert('งานจบก่อนเวลาปัจจุบันไม่ได้');
					return;
				}
			}
			var task = $scope.selected_task.ref_task;
			var old_index_tachnician = $scope.find_tech_index(task.technician.tech_id);
			var index_technician = $scope.find_tech_index($scope.selected_task.tech_id);

			//check if it replace any task *ERROR IF REPLACE A LOCKED TASK*
			//-> calculate the earliest slot that affect
			//NOTE: some duplicate with  < check_free_slot >
			var station = task.station;
			var duration = parseInt($scope.selected_task.duration);
			if(index_technician === -1) index_technician = old_index_tachnician;
			var t_startslot = $scope.selected_task.start_slot;
			var start = -1;	
			var d = duration;
			var k;
			var affected_slot = task.start_slot-1;

			//remove this task from the current timeslot
			for(var i = task.start_slot; i <= task.end_slot;i++){
				$scope.table[i-$scope.row_start][old_index_tachnician].task=null;
			}

			$scope.unlock_task(task.next_task);
			for(k=t_startslot; k-$scope.row_start<$scope.table.length && d>0; k++){
			
				//An occupied slot
				console.log(t_startslot-$scope.row_start+k);
				if($scope.table[k-$scope.row_start][index_technician].task!==null){
					var t = $scope.table[k-$scope.row_start][index_technician].task;
					//opps, a locked slot -> error!
					if(t.locked){
						alert('error: ย้ายไปทับงานที่ Lock อยู่');
						//put the task back
						$scope.fill_table(task);
						return false;
					}
					if(t.start_slot <= $scope.chosen_slot){
						alert('error: ย้ายไปทับงานทีเริ่มไปแล้ว');						
						//put the task back
						$scope.fill_table(task);
						return false;
					}
					//calculate the affected time
					if(t.start_slot<affected_slot) affected_slot = t.start_slot;
					//then we'll take this slot :P
					if(start<0) start = k;
					d--;
				}
				//Free slot
				else if($scope.table[k-$scope.row_start][index_technician].is_holiday===false){
					if(start<0) start = k;
					d--;
				}
				//Holiday Slot: do nothing
			}
			if(d>0){
				alert('error: plan เต็มแล้ว');						
				//put the task back
				$scope.fill_table(task);
				return false;
			}

			//update the value of this task
			task.technician = $scope.technicians[index_technician];
			task.start_slot = start;
			task.duration = duration;
			task.note = $scope.selected_task.note;
			task.skill_level = $scope.selected_task.skill_level;
			task.end_slot = k-1;

			lock_task(task);
			$scope.remove_after(affected_slot-1);			

			//put this slot in plan
			$scope.fill_table(task);
			$scope.put_in_plan();
			
			$scope.cancel_edit_task();
		};
		$scope.cancel_edit_task = function(){
			$scope.show_edit = false;			
			$scope.show_edit_freeze = false;
		};

		$scope.init();
	}
]);
