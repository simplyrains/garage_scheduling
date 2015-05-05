'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	//bpj_no = job_id
	bpj_no: {
		type: String
	},
	station: {
		type: Number
	},
	tech_id: {
		type: String
	},
	start_time: {
		type: Date
	},
	duration: {
		type: Number
	},
	note: {
		type: String
	},
	locked: {
		type: Boolean,
		default: false
	},
	skill_requirements: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Task', TaskSchema);