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
	name: {
		type: String,
		default: '',
		required: 'Please fill Insurance name',
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

mongoose.model('Insurance', InsuranceSchema);