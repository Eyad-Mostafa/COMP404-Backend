export const ResponseFactory = {
  success: (res, message, data = {}, statusCode = 200) => {
    return res.status(statusCode).json({
      message,
      ...data
    });
  },
  
  error: (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
      message,
      error: true
    });
  }
};