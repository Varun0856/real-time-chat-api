import logger from "../utils/winstonLogger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
    errors.push({ field, message });
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    message = "Validation failed";
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    data: null
  });
};

export default errorHandler;
