'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Insurance Schema
 */
var InsuranceSchema = new Schema({
	insurance_name: {
		type: String,
		default: '',
		required: 'Please fill Insurance ID',
		trim: true,
		unique: true
	},
	insurance_displayname: {
		type: String,
		default: '',
		required: 'Please fill Insurance insurance_displayname',
		trim: true
	},
	insurance_tel: {
		type: String
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

mongoose.model('Insurance', InsuranceSchema);