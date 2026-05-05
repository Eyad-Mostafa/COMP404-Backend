export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
      error: true,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
    error: true,
  });
};