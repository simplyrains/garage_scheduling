'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sa Schema
 */
var SaSchema = new Schema({
	sa_id: {
		type: String,
		default: '',
		required: 'Please fill SA ID',
		unique: true
	},
	sa_nickname: {
		type: String,
		required: 'Please fill SA Nickname',
		trim: true
	},
	sa_fullname: {
		type: String,
		default: '',
		required: 'Please fill SA Full Name',
		trim: true
	},
	sa_tel: {
		type: String,
		default: '',
		required: 'Please fill SA Telephone Number',
		trim: true
	},
	sa_signdate: {
		type: Date,
		default: Date.now
	},
	sa_is_resign: {
		type: Boolean,
		default: false
	},
	sa_resigndate: {
		type: Date,
		default: Date.now
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

mongoose.model('Sa', SaSchema);