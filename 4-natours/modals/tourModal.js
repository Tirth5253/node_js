//here in this file means "Modal" folder we can have the "business" logic means all the thing that defines business ex. login validation,DB schema , etc

const Mongoose = require("mongoose");

const tourSchema = new Mongoose.Schema({
                                                                                            //we created the instance of the schema
  name: {
    type: String,
    required: [true, "A tour must have a Name"],                                              //here we have basically created the schema "LAYOUT" for our database, and now you can see that in required its says that if its not true than display the second argument,you can define more than one arguments bt adding {}
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour Must have a price"],
  },
});

const Tour = Mongoose.model("Tour", tourSchema);                                        //here we will merge that upper schema to our modal the first argument is modal name (first letter in uppercase) and the second is schema name that we want to implement

module.exports.Tour;
