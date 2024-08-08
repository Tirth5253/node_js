//here we have put this function in the "controllers" , bcse we think handlers are also the controllers

const AppError = require("../utils/appError")

//==============================GLOBAL MIDDLEWARE FUNCTION FOR OPERATIONAL ERROR HANDLING===============================
                                                                             //here in this section we will write the global middleware that will handles the all "operatinal errors" in the app           

//this function will checks that if our added fields are valid or not Accourding to our schema
const handleValidationErrorDB=err=>{

  const errors=Object.values(err.errors).map(el=>el.message)

  const message=`Invalid Input Data. ${errors.join('. ')}`;
  return new AppError(message,400)
}


//this is the function that will basically handles the error that comes from "MongoDB" CAST ERROR
const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}:${err.value}`
  return new AppError(message,400)
}

//this is the function that will basically handles the error caused by Duplicate fields

const handleDuplicateFieldsDB=err=>{
   const value=err.errmsg.match(/(["'])(\\?.)*?\1/)[0];                               //this is the regular expression that will extract the "Value" in the "errmsg" in the postman  you can see if you get error there is the field named "errmsg" so that contains our duplicate attempt value
   const message=`Duplicate Fields value: ${value} please use another value !`;
   return new AppError(message,400)
}

const handleJWTError=err=>{
  new AppError('Invalid Token. Please Log-in again!', 401)
}


const sendErrorDev=(err,res)=>{
  res.status(err.statusCode).json({
    status:err.status,
    error:err,
    message:err.message,
    stack:err.stack
  })
}

const sendErrorProd=(err,res)=>{
                                                                               //Operational, trusted Error:send Message to client
if(err.isOperational){
  res.status(err.statusCode).json({
    status:err.status,
    message:err.message,
   
  })
}
                                                                              //programming or other unKnown Error==> don't show the error to the client
else{
// 1) log Error
console.error('Error ☠️',err)
//2). Send Generic message
  res.status(500).json({
    status:error,
    message:"Something went wrong"
  })
}
}


module.exports=((err,req,res,next)=>{                                               //here the first argument in the middleware is "err" means it will identify as a "error handling midd." bcse of 4 parameters, the more Error code , you will find on the "appError.js"
 
  err.statusCode=err.statusCode || 500;
  err.status=err.status || "error";

if(process.env.NODE_ENV==='development'){
 sendErrorDev(err,res);
}else if(process.env.NODE_ENV==='production'){
  let error={...err}
   if(error.name==='CastError') error= handleCastErrorDB(error)
   if(error.code===11000) error=handleDuplicateFieldsDB(error);
   if(error.name==='ValidationError') error=handleValidationErrorDB(error);
   if(error.name==='JsonWebTokenError') error =handleJWTError(error)
  sendErrorProd(error,res);
}

})