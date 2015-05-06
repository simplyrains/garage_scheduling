'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Technician = mongoose.model('Technician'),
	_ = require('lodash');

/**
 * Create a Technician
 */
exports.create = function(req, res) {
	var technician = new Technician(req.body);
	technician.user = req.user;

	technician.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technician);
		}
	});
};

/**
 * Show the current Technician
 */
exports.read = function(req, res) {
	res.jsonp(req.technician);
};

/**
 * Update a Technician
 */
exports.update = function(req, res) {
	var technician = req.technician ;

	technician = _.extend(technician , req.body);

	technician.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technician);
		}
	});
};

/**
 * Delete an Technician
 */
exports.delete = function(req, res) {
	var technician = req.technician ;

	technician.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technician);
		}
	});
};

/**
 * List of Technicians
 */
exports.list = function(req, res) { 
	Technician.find().sort('-created').populate('user', 'name').exec(function(err, technicians) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technicians);
		}
	});
};

/**
 * Technician middleware
 */
exports.technicianByID = function(req, res, next, id) { 
	Technician.findById(id).populate('user',  'name').exec(function(err, technician) {
		if (err) return next(err);
		if (! technician) return next(new Error('Failed to load Technician ' + id));
		req.technician = technician ;
		next();
	});
};

/**
 * Technician authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	/*if (req.technician.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}*/
	next();
};
