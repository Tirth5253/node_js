//HERE WE HAVE MAKE THE ROUTE CONTROLLERS MAENS THE CALLBACK IN A SEPERATE FILE AND NAMED "CONTROLLERES" BCSE OF THE "MVC" ARCHITECTURE
//we also have "exports." before all the functions bcse we will export all of them so we can use them in the other file means "tourRoutes"

const Tour=require('../modals/tourModal');
const APIFeatures=require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync=require('../utils/catchAsync');               

//=======================================MIDDLEWARE Function of the   Aliasing In Api fror more read below===========================
                                                                                                   //so the aiasing means if the user want the top 5 cheap tour then he have to write the header that looks like this '127.0.0.1:3000/api/v1/tours?imit=2&sort=-price'  but the problem is user don't know these things he will simply write things like 'top-5-tours' so this function will basically convert them to user friendly
                   exports.aliasTopTours=(req,res,next)=>{
                              req.query.limit='5';
                              req.query.sort='-price';
                              req.query.fields='name,price,ratingsAverage,summery,difficulty';
                              next();
                   }                                        





//================================HERE WE HAVE MADE THE all TOUR's CALLBACKS SEPERATELY =============================


//                  =========================GET ALL TOURS=========================                  //how the "catchAsync" works for more  refer the catchAsync.js


exports.getAllTours = catchAsync(async(req, res,next) => {                                                                            //here this line will says that it will fetches the query that is written in the postman to get the speciffic data,means if i write this in the header of postman "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy" then this console.log will return me this { duration: '5', difficulty: 'easy' },  
       ////for more on Api feature read apiFeature.js   

  console.log(req.query); 
  //  ====executes Query ====
  const features=new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();            //for this explanation read in the "apiFeatures.js"                                  
  const tours=await features.query;                                                                         //this will returns the all the data related to the "Tour",so their is the "req.query" written in it means that it will search or find the data on the basis of the "req.query" ,here "feature.query" is exactly like the "features.Tours" means will returns all the tours data
  
  // =====sends responce===
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { 
      tours,
    },
  });
});

//                     =============================GET callback by ID==================
exports.getTour = catchAsync(async(req, res,next) => {
                                                                                                         //here in this line in the first argument we have defined the ":id" by that we have created the variable/Parameter called "id" it can be anything ,further in console we can get that variable value that we can type in the postMan header like "127.0.0.1:3000/api/v1/tours/5" will gives { id: '5' } bcse of "req.params" and if you have this in GET "'/api/v1/tours/:id/:x/:y" and you write this in header of the Postman will then console will gives this "{ id: '5', x: '45', y: '30' }", if they have the "?" after then they are the optional
  // console.log(req.params);
  // const id = req.params.id * 1;                                                                     //here we have converted our id into the string by multipling the string bcse for comparision in the "find" we want strings in both side
  //   const tour = tours.find((el) => el.id === id);                                               //in this line we have used the "find()" method to array in which we passes the  callback function ==> so it will basically loop throughs the array and each of the iterations we will have access to "el" means for each eterations the logic condition "el===req.params" will be checked, so find method will create an arrays that only contains the element where where logic will gets the true
  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       tours: tour,
  //     },
  //   });


  const tour=await Tour.findById(req.params.id);                                                        //here the findbyid will gives the filter by id which is substitute of "Tour.findOne({_id:req.params.id})"

  if(!tour){
    return next(new AppError('No Tour Found with that Id',404))                                      //here we have modified the status code and message for this perticular case
  }

  res.status(200).json({
        status: "success",
        data: {
          tours: tour,
        },
      });


});

//                          =========================PATCH callback================================

exports.createTour = catchAsync(async(req, res,next) => {
  // console.log(req.body)                                                                      //here in the post request we uses the "req" more. here the 'body' is available in the postman bcse of the middleware

  //   const newId = tours[tours.length - 1].id + 1;                                          //here we have created the code for generating the new or latest id for our latest object to get add
  //   const newTour = Object.assign({ id: newId }, req.body);                                  //so in this line we merge two objects to fit our new id in the data of body of postman, for tha we have used "Object.assign()"=> that is the method to merge the two objects to create one new, here in the assign() method the second argument is the "req.body" means it is the message or the data that we types in the "PostMan"'s body and we uses it here

  //   tours.push(newTour);
                                                                                          //now by this file we have mergerd or push the new object of "newTour" so the tours is ready to updated in our actual file
  //   fs.writeFile(
  //     `${__dirname}/starter/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {

                                                                                            //so we are using the aync await thats why we need to use the try catch [no longer using ]

  const newTour= await Tour.create(req.body);                                                //here we have directly created the document for our database ,and also we have used the async await bcse this function returns the promise, so this is the method in wich the new data comes from the tour and the newTour will get created in the MDB
     
res.status(201).json({                                                                                           //in this code once we updated the array called "newTour" then we write it in the file , then further code says that we have send it to the client so in postman we can see that, in postman if you have written field that is not there then that will get ignored
status: "success",
data: {
  tour:newTour,
}});
  
                                                                                  //we always need to send back something bcse the have to complete cycle of req-res
});

exports.updateTour = catchAsync(async(req, res,next) => {                                               //here we can upadate the any thing on the basis of the id by simply applying the function of the mongoose ,and that will recieves the three args the first one is the id the second one is the new content we want here we aquire that from the "Postman as req.body" and the third one is the "new:true" ==>by this then the updated is the one that will be run not the last one, and the "runValidators" will have to true if "new:true"  that means ex. price should remains the int not String


    const tour=await Tour.findByIdAndUpdate(req.params.id,req.body ,{                                              
      new:true,runValidators:true
    })

    if(!tour){
      return next(new AppError('No Tour Found with that Id',404))                                      //here we have modified the status code and message for this perticular case
    }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour
    },
  });


 
});

exports.deleteTour = catchAsync(async (req, res,next) =>{


    const tour=await Tour.findByIdAndDelete(req.params.id,req.body)

    if(!tour){
      return next(new AppError('No Tour Found with that Id',404))                                      //here we have modified the status code and message for this perticular case
    }

  res.status(201).json({
    status: "success",
    data: null
  });



 
});



//=================================================AGGREGATION PIPELINE===========================================

                                                                                                         //so the the aggregation pipeline means our collection or document will go through the certain operations like "averages" ,"min and max val" etc ,
exports.getTourStats=async(req,res,next)=>{  

  try{
     
      const stats= await Tour.aggregate([                                                                //here in the array we defines the our various stages in the agrreagate functions like various filter query,each stage will be written in the object form, so in the first the "match" filter performed then in result of that we perform "group" filter and then "sort"
 
         {
            $match:{ratingsAverage : {$gte : 4.5}}                                               
         },
         {
            $group:{
              _id :'$difficulty',                                                           //lets say that we have id="difficulty" then this code will execute and we will get the all these results "numRatings,avgRatings" etc for the each of the difficulty EX. for easy we will have these data,for medium and for Hard also so it will calculte all these fields on the basis of the difficulty
              numTours:{$sum : 1},
              numRatings:{$sum : '$ratingsQuantity'},
              avgRating:{$avg : '$ratingsAverage'},                                         //in the "avg" & all  query we have to define the thing that we want to average in '' with the $,so this will return all the documents stat data in 1 json on the basis of the avgRating,avgPrice
              avgPrice:{$avg:'$price'},
              minPrice:{$min : '$price'},
              maxPrice:{$max : '$price'}
            }
         },
         {
          $sort:{avgPrice:1}                                                               //here the 1 means we want in acsending order if you want in the dec. then write -1
         }

      ])
      res.status(200).json({
        status: "success",
        data: {
          data:stats
        },
      }); 
  }
  catch(err){
      
    next(err);

  }
}                                                                                                        

//=================================CHALLANGE BASED ON THE AGGREGATION PIPELINE======================================
                                                                                        //so in this challange we have to find the bussiest month of the year for tours for the "natours" company 
exports.getMonthlyPlan=async (req,res,next)=>{
  try{

      const year=req.params.year*1;                                                      //so what will the "unwind" do? ===>   so suppose the startDate has array and it has 3 elements ex. 1,2,3  so when we use the "unwind" for the "startDate" then it will spread the object like that , it will writes the object and then it will have startingDate as only 1, and then in another same object have starting date as 2 and then 3 so in total we have the 9X3=27 outputs
      const plan=await Tour.aggregate([{
 
          $unwind: '$startDates'
         
      },
      {                                                                                //used match for selecting the year , here we have written the code for that will matches for 2021 year ">1-jan   <31-dec."
        $match: {startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
        }}
      },
      {
        $group: {                                                                        //here we have used the group method in that we if we have id=1 then its jan. and then numToursStart will give the numbers in that month, "$month" is a method or the query of the mongoose 
          _id:{$month : '$startDates'},
          numTourStarts:{$sum : 1},
          tours:{$push : '$name'}                                                       //here we also have the "push" query in the mongoose so, that is used in adding the object into the array and will return a array 
        }
      },
      {
        $addFields:{ month: '$_id'}                                                    //here we have add all the data of the "_id" in the month field so later we can delete the "_id" or we have accurate record field
      },
      {
        $project :{                                                                    //this project is used to show or not show the field ,0 means not to show it
          _id:0,

        }
      },
      {
        $sort:{
          numTourStarts:-1 
        }
      }
    ])

      res.status(200).json({
        status: "success",
        data: {
          plan
        },
      }); 

  }
  catch(err){
    next(err);
  }
}                                                                                      