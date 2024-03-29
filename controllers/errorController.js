const AppError = require('./../utils/AppError');

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error('ERROR 💥', err);

		res.status(500).json({
			status: 'error',
			message: 'Something went very wrong !',
		});
	}
};

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
	const message = `Duplicate field value: ${err.keyValue.name}`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data: ${errors.join(', ')}`;
	return new AppError(message, 400);
};

const handleJWTError = (err) => {
	const message = `Invalid token , please login again`;
	return new AppError(message, 401);
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else {
		let newError = Object.assign(err);
		if (err.name == 'CastError') {
			newError = handleCastErrorDB(newError);
		} else if (err.code == 11000) {
			newError = handleDuplicateFieldsDB(newError);
		} else if (err.name == 'JsonWebTokenError' || err.name == 'TokenExpiredError') {
			newError = handleJWTError();
		} else if (err.hasOwnProperty('_message') && err._message.includes('validation failed')) {
			newError = handleValidationErrorDB(newError);
		}

		sendErrorProd(newError, res);
	}
};
