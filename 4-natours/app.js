const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes"); //here we have imported the router middleWare function from the file of "tourRoutes"  so we can use it as here in the "app.use('/api/v1/tours',tourRouter) " we actually get what we exported in that file so in that file we actually imported the "router" so here we get that
const userRouter = require("./routes/userRoutes");

//======================================SET security HTTP headers midd.===========================================     //if you go to the postman and see the header and then you will ssee some extra heaxers that defines the security headers
app.use(helmet());

//=======================================IMPLEMENTING THE RATE LIMITING===================================================

//====>the rate limiting means when more api requests are made by the sinlgle IP add. then due to that the problems like denial of service and brute force attacks so, by this we can block the multiple requests and prevent this multiple attacks , and due to that this has to be at the top of the all
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again this later !",
});
app.use("/api", limiter);

app.use("/api/v1/tours", tourRouter); //here in this code we have made the router which we made a custom router for Tour data and then so we can use it all along the application that's why ,we have made it the "MiddleWare" and now instead of "app" we will use "router" and in the ".route" we only have to add those path remaining that comes after the "/api/v1/tours" ===> this process is called the "Mounting the router" ===> here this line says that we want to implement "tourRouter" as a middleware for this router path "/api/v1/tours"
app.use("/api/v1/users", userRouter);

//=========================================HANDLING THE UNHANDLED ROUTES============================================
//here in this section we will handle routes that are undefined EX. "127.0.0.1:3000/api/v1/toursss" , so here we have used the ".all()" method so that means it includes all the methods and applies to all the methods , in first argument as a url we have used the "*" bcse it will includes all the words ===>NOTE: why we used it after the routes ==> so when we type the route in postman and it matches the url in the "Routes" [upper] section AND if its not matching then it will comes to this "MIDDLEWARE"
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status:"FAIL",
  //   message:`Can't find ${req.originalUrl} on this server!`
  // })

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400)); //here we passing the "Apperr" in the next means midd. ware will recognize that erroe has been occured and then it will skips all the middlware belows it and directly jumps to our global error handling middleware , bcse that middleware also have the "err" property
});

//==============================================Body Parser Middlewares==============================================
app.use(express.json({ limit: "10kb" })); //this line tells about the middleware, middleware will be stands between request and responce to modify data,for "POST" method we will need the Middlware ,more on the middleware in next lectures, in middleware the request will be passes through, if you cannot uses the middleware then you cannot sees the json data in the vs code terminal that we have send from the postMan's body   ,,here the "use" method is used to add the middleware in the middleware Stack
// app.use(express.static(`${__dirname}/starter/public`)); //here this is the middleware that is used to access the static files like html,images,any file via "Browser URL" you dont have to write the "public" in the browser like there is html file in the public than you can access by this "http://127.0.0.1:3000/overview.html"

//===========================================DATA SANITIZATION=====================================================
//data sanitization means to clean all the data that comes into app from the malicious code,and in this case we are trying to do this two attacks , and this is the best place for this middleware to place after we fetches the json data from the user

// =======>1). Data sanitization against NoSql injection                                      //EX. so in this attack even you do not have the email then still you can login for ex.. in the body of postman { "email":{$gt:""}, "password":"2232323"} this will logs us as the admin bcse  this condition "email":{$gt:""} will always gives us the true and for this type of the problem we uses the package called the "express-mongo-sanitize"
app.use(mongoSanitize());
// 2). Data sanitization again XSS                                                           //when some user is trying to insert some malicious html code with the some JS code  if it would inject to the our site then this could really affect the our website
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//===================================MiddleWare by 3rd PARTY===================================================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} //this is the third party middleware and that will return us the what api method and which url has been requested and also the status header and time of execution also , this is just a simple middleWare

//==============================GLOBAL MIDDLEWARE FUNCTION FOR OPERATIONAL ERROR HANDLING===============================

app.use(globalErrorHandler); // all the logic for it is in the "errorController"

module.exports = app; //here we have exported it so the server file can use it
