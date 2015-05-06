'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Insurance = mongoose.model('Insurance'),
	_ = require('lodash');

/**
 * Create a Insurance
 */
exports.create = function(req, res) {
	var insurance = new Insurance(req.body);
	insurance.user = req.user;

	insurance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insurance);
		}
	});
};

/**
 * Show the current Insurance
 */
exports.read = function(req, res) {
	res.jsonp(req.insurance);
};

/**
 * Update a Insurance
 */
exports.update = function(req, res) {
	var insurance = req.insurance ;

	insurance = _.extend(insurance , req.body);

	insurance.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insurance);
		}
	});
};

/**
 * Delete an Insurance
 */
exports.delete = function(req, res) {
	var insurance = req.insurance ;

	insurance.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insurance);
		}
	});
};

/**
 * List of Insurances
 */
exports.list = function(req, res) { 
	Insurance.find().sort('-created').populate('user', 'displayName').exec(function(err, insurances) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(insurances);
		}
	});
};

/**
 * Insurance middleware
 */
exports.insuranceByID = function(req, res, next, id) { 
	Insurance.findById(id).populate('user', 'displayName').exec(function(err, insurance) {
		if (err) return next(err);
		if (! insurance) return next(new Error('Failed to load Insurance ' + id));
		req.insurance = insurance ;
		next();
	});
};

/**
 * Insurance authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.insurance.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
