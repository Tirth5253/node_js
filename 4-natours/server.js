//here in our project we have sepereted all the files on the basis of their functionalities
//here in this file we have all the code that is written for the server of the express where everything starts
//here now we have to use now "nodemon server.js" bcse now this file is the entry point
const Mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// const e = require("express");


Mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,                                                      //here in this line we have used the mongoose ,that is the library to connect our data base into with the Node.js and this ".connect()" method will return the promise that will be handled by the ".then" that will shares the information about the db connection
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then((con) => {
  
  console.log("DB connection successful!");
});

const port = 3000;
app.listen(port, () => {
                                                                                       //here in the express we have some similarities like "http" server
  console.log(`App running on port ${port} .....`);
});
