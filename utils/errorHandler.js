const createError = require('http-errors')

// // error handler
const errorHandler = function (
    err,
    req,
    res,
    next
  ) {
    if (process.env.NODE_ENV === "development") {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
  
      // render the error page
      res.status(err.status || 500);
      res.render("error");
    } else {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "production" ? err : {};
      
      // render the error page
      res.status(err.status || 500);
      res.render("error");
    }
  };



module.exports = errorHandler