const express=require('express');
const app=express();
const morgan=require('morgan');
app.use(express.json());                                                                       //this line tells about the middleware, middleware will be stands between request and responce to modify data,for "POST" method we will need the Middlware ,more on the middleware in next lectures, in middleware the request will be passes through, if you cannot uses the middleware then you cannot sees the json data in the vs code terminal that we have send from the postMan's body   ,,here the "use" method is used to add the middleware in the middleware Stack

const tourRouter=require('./routes/tourRoutes')                                                //here we have imported the router middleWare from the file of "tourRoutes"  so we can use it as here in the "app.use('/api/v1/tours',tourRouter) " we actually get what we exported in that file so in that file we actually imported the "router" so here we get that  
const userRouter=require('./routes/userRoutes')

app.use('/api/v1/tours',tourRouter)                                                            //here in this code we have made the router which we made a custom router for Tour data and then so we can use it all along the application that's why ,we have made it the "MiddleWare" and now instead of "app" we will use "router" and in the ".route" we only have to add those path remaining that comes after the "/api/v1/tours" ===> this process is called the "Mounting the router" ===> here this line says that we want to implement "tourRouter" as a middleware for this router path "/api/v1/tours"
app.use('/api/v1/users',userRouter)


app.use(express.static(`${__dirname}/starter/public`));                                               //here this is the middleware that is used to access the static files like html,images,any file via "Browser URL" you dont have to write the "public" in the browser like there is html file in the public than you can access by this ""

//===============================================CREATING OUR OWN MIDDLEWARE===========================================

app.use((req,res,next)=>{                                                                      //here in this section we makes our own middleware..there is middleware STACK between every request and responce,so every request passes through vareius and many middleware ,and that middleware makes changes according to their code , and to jump from one middleWare to another there is a function "NEXT" at last of the every middlewares here we have also the third argument as a "next" you can name anything you want, here you have to be carefull with the order of the code of the middleware bcse if you defines it bottom we will not get any message from middleware bcse  it will sends the message to all the HTTP methods that are below to it
    console.log("Hello from the middleWare 🖐🏽");
    next();                                                                                     //IF we don't use the "next()" then our Req. Res. will get stuck and user will not get any messages
 })
 
 
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
})

//===================================MiddleWare by 3rd PARTY===================================================
app.use(morgan('dev'));                                                                           //this is the third party middleware and that will return us the what api method and which url has been requested and also the status header and time of execution also , this is just a simple middleWare



////                    =======GET method ===========
////app.get('/',(req,res)=>{
////    res.status(200).json({message:"Hello this is from the server side", app:"Natours" });                                  //here this line determines the routing in the express means for which route we will show which data, so expressVariable.method here it is GET and then in that get method there is two arguments,first one is the path and the second one is the callback function

////})                                                                                              //for sending the message to the client side we have ".send()" method and also you can send the "json()" method to send the json data.., to define the status code we have ".status()"

////                =========== POST method ==========
////app.post('/',(req,res)=>{
////    res.send("you can post this endpoint .....")                                            //here it is the "POST" method means the 
////})


module.exports=app;                                                   //here we have exported it so the server file can use it


















