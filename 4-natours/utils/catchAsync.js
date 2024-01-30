//==============================REUSABLE & ELIMINATION CODE FOR THE "TRY CATCH" BLOCK=====================================
                                                                                                      //so as we can see in the below codes in (method contrlrs) that there is try catch block in all the code so we put them in the higher order so we don't have to write it every time , here This function catchAsync takes another function fn as an argument, catch async also returns a new function that takes req, res, and next as parameters. Inside the returned function, it executes fn(req, res, next) ,and that also return a catch bcse "fn" means the function passes in the place of "fn" means our function that passes in (catchAsync) in below code, so that is async function and it returns the promise and if we promise get rejected we have to handle it by "catch", if it rejects than our error will be passed into the "next(err)" so by this our error will pass to the our "errorController" module middleware function ,and in the below in "getAllTours" we used the "catchAsync" as wrap to async function
                                                                                                      //The catchAsync function helps to avoid repeating try...catch blocks in every asynchronous route handler by wrapping them in a reusable function.
                                                                                                      //here we have write "return (req,res,next)" so the fn can have acces to these 3 variables 
                                                                                                      //By passing next to the inner function, it ensures that any errors caught during the execution of the asynchronous operation can be passed to Express's error handling middleware. 
                                                                                                      //the Main reason to write the "return" is bcse we have to assign the value to the "getAllTours"
                                                                                                      //NOTE==> THIS THING IS NOT COMPULSARY THIS JUST TO SHOW THAT HOW THE Async FUN. works, and also for pas lec. code i will not write this method to all, just for the "getAllTour" &  "getTour"  SORRY i have done it all
                                                                                                      //and this function will be only works if the child is async
//  const catchAsync=(fn)=>{

   module.exports=(fn)=>{
    return (req,res,next)=>{
      fn(req,res,next).catch(err=>next(err));
    }
}
