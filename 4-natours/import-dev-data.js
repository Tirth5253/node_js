//so this is the file which is out of the scope of our project
//so basically this file will collect our data from the json file and then will load all the data to the mongoDB dataBase in just by function
const fs=require('fs')
const dotenv = require("dotenv");
const Mongoose = require("mongoose");
const Tour=require('./modals/tourModal')
dotenv.config({ path: "./config.env" });

Mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,                                                      //here in this line we have used the mongoose.connect() ,that is the library to connect our data base into with the Node.js and this ".connect()" method will return the promise that will be handled by the ".then" that will shares the information about the db connection
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then((con) => {
  console.log(con.connections);
  console.log("DB connection successful!");
});


//Read the JSON file

const tours=JSON.parse(fs.readFileSync('./starter/dev-data/data/tours-simple.json','utf-8'));                //here we have converted the json format code to js object by"JSON.parse()"

//IMPORT data into the dataBase

const importData=async()=>{
    try{
        await Tour.create(tours);                                                                 //here we have passed the Js object in the create() not the string, so it will create document for every object, not writes every thing in the same one object 
        console.log('Data succcessully Loaded!')
    }catch(err){
          console.log(err);
    }
}

//DELETE the existing data before we inserts in it

const deleteDB=async()=>{
    try{
        await Tour.deleteMany();                                                                 //here we have passed the Js object in the create() not the string, so it will create document for every object, not writes every thing in the same one object 
        console.log('Data succcessully Deleted!')
    }catch(err){
          console.log(err);
    }
}

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteDB();
}
console.log(process.argv);