'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Car = mongoose.model('Car'),
	_ = require('lodash');

/**
 * Create a Car
 */
exports.create = function(req, res) {
	var car = new Car(req.body);
	car.user = req.user;

	car.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * Show the current Car
 */
exports.read = function(req, res) {
	res.jsonp(req.car);
};

/**
 * Update a Car
 */
exports.update = function(req, res) {
	var car = req.car ;

	car = _.extend(car , req.body);

	car.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * Delete an Car
 */
exports.delete = function(req, res) {
	var car = req.car ;

	car.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(car);
		}
	});
};

/**
 * List of Cars
 */
exports.list = function(req, res) { 
	Car.find().sort('-created').populate('user', 'displayName').exec(function(err, cars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cars);
		}
	});
};

/**
 * Car middleware
 */
exports.carByID = function(req, res, next, id) { 
	Car.findById(id).populate('user', 'displayName').exec(function(err, car) {
		if (err) return next(err);
		if (! car) return next(new Error('Failed to load Car ' + id));
		req.car = car ;
		next();
	});
};

/**
 * Car authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.car.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
