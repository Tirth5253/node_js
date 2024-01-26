//here in this file means ,"Modal" folder we can have the "business" logic means all the thing that defines business ex. login validation,DB schema ,all data for API etc

const Mongoose = require("mongoose");

const tourSchema = new Mongoose.Schema({
                                                                                            //we created the instance of the schema
  name: {
    type: String,
    required: [true, "A tour must have a Name"],                                              //here we have basically created the schema "LAYOUT" for our database, and now you can see that in required its says that if its not true than display the second argument,you can define more than one arguments bt adding {}
    unique: true,
    trim:true
  },
  duration:{
     type:Number,
     required:[true,'A tour must have a Duration']
  },
  maxGroupSize:{
    type:Number,
    required:[true,'A tour must have Grouo Size']
  },difficulty:{
    type:String,
    required:[true,'A tour must have the difficulty']
  },
  ratingsAverage:{
    type:Number,
    default:4.5
  },ratingsQuantity:{
    type:Number,
    default:0
  },
  rating:{
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour Must have a price"],
  },
  priceDiscount:{
    type:Number,
  },
  summary:{
    type:String,
    trim:true,
    required:[true,'A tour must have a summery']
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true,'A tour must have a imageCover']
  },images:[String],                                     //this images will be stored in the array of the strings
  createdAt:{
    type:Date,
    default:Date.now(),                                                             //this is saying that if the date is not defined than we have it fefault as now date
  },
  startDates:[Date]
});

const Tour= Mongoose.model("Tour", tourSchema);                                        //here we will merge that upper schema to our modal the first argument is modal name (first letter in uppercase) and the second is schema name that we want to implement
module.exports = Tour;

