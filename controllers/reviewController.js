const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlerfactory');

exports.setTourUserIds = (req, res, next) => {
	if (!req.body.tour) req.body.tour = req.params.id;
	if (!req.body.user) req.body.user = req.user.id;
	next();
};

exports.createReview = createOne(Review);
exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
