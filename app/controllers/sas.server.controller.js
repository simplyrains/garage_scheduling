'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sa = mongoose.model('Sa'),
	_ = require('lodash');

/**
 * Create a Sa
 */
exports.create = function(req, res) {
	var sa = new Sa(req.body);
	sa.user = req.user;

	sa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sa);
		}
	});
};

/**
 * Show the current Sa
 */
exports.read = function(req, res) {
	res.jsonp(req.sa);
};

/**
 * Update a Sa
 */
exports.update = function(req, res) {
	var sa = req.sa ;

	sa = _.extend(sa , req.body);

	sa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sa);
		}
	});
};

/**
 * Delete an Sa
 */
exports.delete = function(req, res) {
	var sa = req.sa ;

	sa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sa);
		}
	});
};

/**
 * List of Sas
 */
exports.list = function(req, res) { 
	Sa.find().sort('-created').populate('user', 'displayName').exec(function(err, sas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sas);
		}
	});
};

/**
 * Sa middleware
 */
exports.saByID = function(req, res, next, id) { 
	Sa.findById(id).populate('user', 'displayName').exec(function(err, sa) {
		if (err) return next(err);
		if (! sa) return next(new Error('Failed to load Sa ' + id));
		req.sa = sa ;
		next();
	});
};

/**
 * Sa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.sa.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
