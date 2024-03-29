const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/APIFeatures');

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		// to allow nested GET reviews on tour (hack)
		let filter = {};
		if (req.params.id) filter = { tour: req.params.id };
		const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
		const doc = await features.query; // execute query

		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: { data: doc },
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const data = await Model.create(req.body);
		res.status(201).send({
			status: 'success',
			data: { data: data },
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(200).json({
			status: 'success',
			data: { doc },
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(200).json({
			status: 'success',
			data: { data: doc },
		});
	});

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}
		res.status(204).json({
			status: 'success',
			data: null,
		});
	});
