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
	customer_name: {
		type: String,
		default: '',
		required: 'Please fill customer_name',
		trim: true
	},
	customer_tel: {
		type: String,
		//required: 'Please fill customer_tel',
		trim: true
	},
	insurance: {
		//required: 'Please fill insurance',
		type: String,
	},
	name_plate: {
		type: String,
		required: 'Please fill name_plate',
		trim: true
	},
	model_id: {
		type: String,
		//required: 'Please fill model_id',
		trim: true
	},
	colour_id: {
		type: String,
		//required: 'Please fill colour_id',
		trim: true
	},

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