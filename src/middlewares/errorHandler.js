// middlewares/errorHandler.js


const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let data = null;

  // Check if it's a validation error (from Joi via http-errors)
  if (status === 400 && err.errors) {
    // Log the detailed validation errors to the backend console
    console.error("=== Validation Error Details ===");
    console.error(JSON.stringify(err.errors, null, 2)); // Log details!
    console.error("==============================");

    message = err.message; // Keep original "Bad Request" or similar
    data = { details: err.errors }; // Optionally send details back

  } else {
    // Log other types of errors
    // Avoid logging full stack in production for non-500 errors if desired
    console.error(`[${status}] ${message}`, status >= 500 ? err.stack : '');
  }

  res.status(status).json({
    status,
    message,
    data,
  });
};

export default errorHandler;