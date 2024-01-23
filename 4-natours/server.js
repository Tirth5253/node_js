//here in our project we have sepereted all the files on the basis of their functionalities 
//here in this file we have all the code that is written for the server of the express where everything starts

const app=require('./app');

const port=3000; 
app.listen(port,()=>{                                                                      //here in the express we have some similarities like "http" server
    console.log(`App running on port ${port} .....`);
});
