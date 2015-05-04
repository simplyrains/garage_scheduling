'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Car Schema
 */
var CarSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Car name',
		trim: true
	},
	tech_id: {
		type: String,
		required: 'Please fill Technician ID',
		trim: true
	},
	tech_fullname: {
		type: String,
		default: '',
		required: 'Please fill Technician Name',
		trim: true
	},
	tech_signdate: {
		type: Date,
		default: Date.now
	},
	tech_is_resign: {
		type: Boolean,
		default: false
	},
	tech_resigndate: {
		type: Date,
		default: Date.now
	},
	tech_holiday: {
		type: Number,
		default: 0,
		required: 'Please fill Technician Holiday'
	},
	//Station Number: 0, 1, 2, 3, and so on..
	tech_main_station: {
		type: Number,
		required: 'Please fill Technician Main Station'
	},

	tech_exholidays: [
			{
				start:Date,
				end:Date
			}
	],
	tech_skills: [
			{
				skill_id: String
			}
	],

	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Car', CarSchema);