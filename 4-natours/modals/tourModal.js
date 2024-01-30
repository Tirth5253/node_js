//here in this file means ,"Modal" folder we can have the "business" logic means all the thing that defines business ex. login validation,DB schema ,all data for API etc

const Mongoose = require("mongoose");
const slugify=require('slugify')
const validator =require('validator')

const tourSchema = new Mongoose.Schema({
                                                                                            //we created the instance of the schema
  name: {
    type: String,
    required: [true, "A tour must have a Name"],                                              //here we have basically created the schema "LAYOUT" for our database, and now you can see that in required its says that if its not true than display the second argument,you can define more than one arguments bt adding {}
    unique: true,
    trim:true,
    maxlength:[40,'A tour must less or equal than 40 char '],
    minlenght:[10,'A tour must more or equal than 40 char '],
    // validate:[validator.isAlpha,"Tour name must only contains Characters"]                    //here we have used the build in validator "isAlpha" from the library that we have installed called "validator"
  },
   slug:{
    type: String,

   }
  ,
  duration:{
     type:Number,
     required:[true,'A tour must have a Duration']
  },
  maxGroupSize:{
    type:Number,
    required:[true,'A tour must have Grouo Size']
  },difficulty:{
    type:String,
    required:[true,'A tour must have the difficulty'],
    enum:{
      values:['easy','medium','difficult'],
      message:'Difficulty is either: easy, medium or difficult '
    }
  },
  ratingsAverage:{
    type:Number,
    default:4.5,
    min:[1,'ratings should be above 1'],
    max:[5,'ratings should be below 5']

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
    validate: {
      
      validator:function(val){                                                        //that is the custom validator we have made , we uses the "validate" fields and "validator" property to write the function, in function the "val" property indiacates the "priceDiscount" means the current field , here "this" only points to the current doc on NEW document creation [in the postman in post method]
        return val<this.price
   },
      message:'Discount price ({VALUE}) should be below regular price'
    }
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
  startDates:[Date],

  secretTour:{
    type:Boolean,
    default:false  
}
},
{
    toJSON:{virtuals:true},                                                         //here in this line it says that every time when we call the JSON then we want "virtual" fields to b part of the DB, by default it is not shown
    toObject:{virtuals:true} 
  }
);

//=============================================VIRTUAL PROPERTIES================================================
                                                                                     //so the virtual properties are the properties that we write in the schema but not stored in the database EX. the use of that is when we derives the a property from some another 2 property then that 2 property are no need to store in the database
                                                                                    // here we counts the duration of the Tour
tourSchema.virtual('durationWeeks').get(function() {                                //NOTE : here we have used the regular function instead of the arrow bcse arrow fun. does not get its own "this" keyword, and you cannot use the "virtual" fields in the query
  return this.duration / 7;  
})

//=======================================DOCUMENT MIDDLEWARE============================================================
                                                                                        //just like in express in MONGODB we also have the middleware ,there is 4 types of the middlewares document,query,aggregation,model , we also have the "next()" function in this MIDD.
                                                                                        //the document middleware will run on the document updation thats why it have  the two type of middleware "pre hooks" and "post hooks" ,EX. if you want to run a function after the user want to send the data into DB
tourSchema.pre('save',function(next){                                                   //so here we used the "pre" hook and in that we have first argument is Event "save" and the second is the function that we want to call when save happens  NOTE: document middleware only runs on the  events like " .save() .create() .remove() .validate() init  etc "    
  this.slug=slugify(this.name,{lower:true});                                           //what this function will do?, so when ever we save the any document in schema it will automatically generates the slug and add it to "slug" field 
  next();  
})

// tourSchema.post('save',function(doc,next){                                            //in the case of the "post" middleware we have the 1 extra variable in access that is our document that we have saved ,commented bcse i dont want to be it logged every time i save 
//   console.log(doc);
//   next();
// })


//==========================================QUERY MIDDLEWARES=====================================================
                                                                                       //just like document middleware "QUERY" middleware will be run before of after the query is executed
tourSchema.pre(/^find/,function(next){                                                 //here the middleware will run when the "find()" query will be executed ,here this keyword will points the "current Query"
  this.find({secretTour : {$ne : true}})                                              //CONTEXT: here lets say we have the field called "secretTour" if that is true then we don't want to show that tour in the "get" ,this basically says before any "find()" will executes this function of the middleware NOTE ==> the "find" in function signature and in the function are diff. bcse here this will returns a query so in the function we have chained the another "find"  , here "/^find/" says that we want to execute middleware in every query starting from "find" by that we can apply it to the "findOne findOneAndDelete findOneAndRemove etc etc" query also
  this.start=Date.now();
  next()
})

tourSchema.post(/^find/,function(docs,next){                                        //here in the "post" middleware we can have the document that is returned by the "query"
  // console.log(docs);
  console.log(`query took the ${Date.now() - this.start} milliseconds`)
  next(); 
})


//==================================AGGREGATION MIDDLEWARE========================================================
                                                                                   //by taking the pre. context we also want to exclude the "Special Tour" in the aggregation pipeline 
tourSchema.pre('aggregate',function(next){                                         //here this will points to the current "aggregation" object
  console.log(this.pipeline()); 
  this.pipeline().unshift({$match:{secretTour: {$ne:true}}});                       //here the "this.pipeline" returns the array of pipeline op. so we want to add match as a "first element" for that we have used the "unshift" so it will add match to first then all the filter will get added  
  next();
})


const Tour= Mongoose.model("Tour", tourSchema);                                        //here we will merge that upper schema to our modal the first argument is modal name (first letter in uppercase) and the second is schema name that we want to implement
module.exports = Tour;

