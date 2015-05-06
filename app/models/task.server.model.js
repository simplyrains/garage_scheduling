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
	job: {
		type: Schema.ObjectId,
		ref: 'Job'
	},
	technician: {
		type: Schema.ObjectId,
		ref: 'Technician'
	},
	date: {
		type: Date
	},
	start_slot: {
		type: Number
	},
	duration: {
		type: Number,
		required: 'Please fill duration'
	},
	note: {
		type: String
	},
	locked: {
		type: Boolean,
		default: false
	},
	skill_requirements: {
		type: String,
		required: 'Please fill skill_requirements'
	},
	station: {
		type: Number,
		required: 'Please fill station'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Task', TaskSchema);