class AppError  extends  Error{                               //this class will inherits all the property of the Error class

  constructor(message,statusCode){
    super(message);                                                               //here the "super" indiacates that it will call or say brings the contructor of the "Error" class and then assign the "message" to the "Error" class ,so that class will prints that messsage as an error
    this.statusCode=statusCode;
    this.status=`${statusCode}`.startsWith('4') ? 'fail': 'error' ;
    this.isOperational=true;                                                     //by this thing we can off this "AppError" on the error that are not operational Ex. like syntax errors etc


    Error.captureStackTrace(this,this.constructor);                            //you're essentially instructing JavaScript to capture the current call stack (the sequence of function calls that led to the creation of the error object) and attach it to the error object itself.
}

}
module.exports=AppError;