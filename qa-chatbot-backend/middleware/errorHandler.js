const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      code,
      statusCode,
      stack: err.stack
    });
  }

  res.status(statusCode).json({
    error: message,
    code
  });
};

export default errorHandler;
