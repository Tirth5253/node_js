//here in our project we have sepereted all the files on the basis of their functionalities
//here in this file we have all the code that is written for the server of the express where everything starts
//here now we have to use now "nodemon server.js" bcse now this file is the entry point
const Mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

// const e = require("express");

process.on("uncaughtException", (err) => {
  //this uncaught exception function only catches that exeptions that is below this code
  console.log("UNCAUGHT EXCEPTION! 🥲 Shutting Down.....");
  console.log(err.name, err.message);
  process.exit(1);
});

Mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true, //here in this line we have used the mongoose ,that is the library to connect our data base into with the Node.js and this ".connect()" method will return the promise that will be handled by the ".then" that will shares the information about the db connection
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then((con) => {
  console.log("DB connection successful!");
});

const port = 3000;
const server = app.listen(port, () => {
  //here in the express we have some similarities like "http" server
  console.log(`App running on port ${port} .....`);
});
//here below is the code when we got caught unhandled Rejection or promice , this code is applied globally bcse of the "Process" and in that "process.exit()" is the method that will be used to stop all the activities or the process , to exits all the process and make this activity more smooth we will first closes the server
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🥲 Shutting Down.....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
