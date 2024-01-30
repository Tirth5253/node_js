//here we have put this function in the "controllers" , bcse we think handlers are also the controllers

//==============================GLOBAL MIDDLEWARE FUNCTION FOR OPERATIONAL ERROR HANDLING===============================
                                                                             //here in this section we will wite the global middleware that will handles the all "operatinal errors" in the app           
module.exports=((err,req,res,next)=>{                                               //here the first argument in the middleware is "err" means it will identify as a "error handling midd." bcse of 4 parameters, the more Error code , you will find on the "appError.js"
 
  err.statusCode=err.statusCode || 500;
  err.status=err.status || "error";

  res.status(err.statusCode).json({
    status:err.status,
    message:err.message
  })
})