//HERE WE HAVE MAKE THE ROUTE CONTROLLERS MAENS THE CALLBACK IN A SEPERATE FILE AND NAMED "CONTROLLERES" BCSE OF THE "MVC" ARCHITECTURE
//we also have "exports." before all the functions bcse we will export all of them so we can use them in the other file means "tourRoutes"

const Tour=require('../modals/tourModal');

// const fs = require("fs");
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`the tour id is ${val}`);                                                          //here is the another middleware function that we passes in the middleware that we have make to want to check if user has types the valid "id" or not and in this perticular middleware we have the 4 parameters and the 4th one is the  "val"  that contains the value of the "id" ,NOTE: you can have used the function and call in all the callbacks but that's the how the EXPRESS works in pipelines
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log("there is no name or price");                                                 //here is the middleware function that will be checking the "req.body" means the message send from the PostMan have "Name" or "Price" or not
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "No Name or Price",
//     });
//   }
//   next();
// };

//================================HERE WE HAVE MADE THE all TOUR's CALLBACKS SEPERATELY so later we export===============================

//                  =========================GET ALL TOURS=========================
exports.getAllTours = async(req, res) => {                                                                            //here this line will says that it will fetches the query that is written in the postman to get the speciffic data,means if i write this in the header of postman "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy" then this console.log will return me this { duration: '5', difficulty: 'easy' },  
  try{
    

//  1A.      ======Build Query & filtering=======
  const queryObj={...req.query};                                                                      //here we have created the "shallow Copy" of the "req.query" object by destruct. means if we make changes in the "queryObj" then it will not affects the "req.query" WHY WE NEED ==> suppose we have a query in the header like   "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy&page=2"   so here we can see that "page" is the pagination object so it needs in the pagination   means it will be not in the database so we may nedd to update "req.query" thats why                 
  const excludedFields=['page','sort','limit','fields'];                                             //this is the fields that we want to remove from our querObj so we can have only purely "req.query" elements
  
  excludedFields.forEach(el=>delete queryObj[el]);                                                   //here is the function that we have made using the "for each" bcse we don't want to create a new array so the "excludedFields" will be deleted from the "queryObj"


  //1B.  ===================ADVANCE FILTERING===================================
                                                                                               //so what is advance filtering called so lets take example we want to type query in the header of the postman like this "127.0.0.1:3000/api/v1/tours?duration[lte]=5&difficulty=easy" so this says that we want the suration that is lessthan 5 so if want to type query in the magoose that will be like this  "{ duration: { $lte: '5' }, difficulty: 'easy' }" and if you concole it the terminal says the "{ duration: { lte: '5' }, difficulty: 'easy' }"  so there is only a difference of the "$" in both so we will add the "$" in the "req.query" so we can execute it like the mongoose query
    let querystr=JSON.stringify(queryObj);
    querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);                      //so here we have writen the code of the replacement in replace the code written "//" called teh regulare exprassion and the "\b" is used to replace the string that only consists "lte" like the words means word like "mnlte" will not replaced,and the "/g" will replaces these words at all the where not the first time and theres the second argument is callback function that will replaces the match ==> $match means lte ===> $lte
    console.log(JSON.parse(querystr))                                                          //here we have again converts the string to "JSON object"

    let query=Tour.find(JSON.parse(querystr));                                                                  //why we use the "await" here later ,bcse if you use query "Tour.find(queryObj)" directly in the await then we have no chance to edit further Ex. if i want to add the methods like the "page" "linit" etc bcse once we writes the await then the data will get send there is no scope of the editing, thats wht we use a variable "query" to store that data before it goes to await,and here we have defined the "query" by let so later we can change it


//2.    ===================== Sorting ====================

if(req.query.sort){
  const sortBy=req.query.sort.split(',').join('  ');                                        //this is the query when there is a tie b/w the prices than they will be ranked in terms of the ratingsAvereage,this line will make our types this "-price,ratingsAverage" to like this that mongoose can understand "-price ratingsAverage"
  console.log(sortBy);
    query=query.sort(sortBy);
}else {
  query=query.sort('-createdAt')
}


//3.  ==================Field Limiting====================
                                                                                           //here the fields limiting means that the user only wants the certain fields ex "127.0.0.1:3000/api/v1/tours/fields"
if(req.query.fields){
  const fields=req.query.fields.split(',').join(' ');
  query=query.select(fields)
}else{
  query=query.select('-__v')
}

  
  console.log(req.query); 
  //  ====executes Query ====
  const tours=await query;                                                                         //this will returns the all the data related to the "Tour",so their is the "req.query" written in it means that it will search or find the data on the basis of the "req.query" 
  console.log()
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });}catch(err){
    res.status(400).json({
      status:"fail",
      message:err
    })
  }


};

//                     =============================GET callback by ID==================
exports.getTour = async(req, res) => {
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

try{
  const tour=await Tour.findById(req.params.id);                                                        //here the findbyid will gives the filter by id which is substitute of "Tour.findOne({_id:req.params.id})"

  res.status(200).json({
        status: "success",
        data: {
          tours: tour,
        },
      });
}catch(err){
  res.status(400).json({
    status:"fail",
    message:err
  })
}

};

//                          =========================PATCH callback================================

exports.createTour = async(req, res) => {
  // console.log(req.body)                                                                      //here in the post request we uses the "req" more. here the 'body' is available in the postman bcse of the middleware

  //   const newId = tours[tours.length - 1].id + 1;                                          //here we have created the code for generating the new or latest id for our latest object to get add
  //   const newTour = Object.assign({ id: newId }, req.body);                                  //so in this line we merge two objects to fit our new id in the data of body of postman, for tha we have used "Object.assign()"=> that is the method to merge the two objects to create one new, here in the assign() method the second argument is the "req.body" means it is the message or the data that we types in the "PostMan"'s body and we uses it here

  //   tours.push(newTour);
                                                                                          //now by this file we have mergerd or push the new object of "newTour" so the tours is ready to updated in our actual file
  //   fs.writeFile(
  //     `${__dirname}/starter/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {

  try {                                                                             //so we are using the aync await thats why we need to use the try catch

  const newTour= await Tour.create(req.body);                                                //here we have directly created the document for our database ,and also we have used the async await bcse this function returns the promise, so this is the method in wich the new data comes from the tour and the newTour will get created in the MDB
     
res.status(201).json({                                                                                           //in this code once we updated the array called "newTour" then we write it in the file , then further code says that we have send it to the client so in postman we can see that, in postman if you have written field that is not there then that will get ignored
status: "success",
data: {
  tour:newTour,
}});
  }catch (err){
    console.log(err)
      res.status(400).json({
      status:'fail',
      message:err
  })
}


                                                                                  //we always need to send back something bcse the have to complete cycle of req-res
};

exports.updateTour = async(req, res) => {                                               //here we can upadate the any thing on the basis of the id by simply applying the function of the mongoose ,and that will recieves the three args the first one is the id the second one is the new content we want here we aquire that from the "Postman as req.body" and the third one is the "new:true" ==>by this then the updated is the one that will be run not the last one, and the "runValidators" will have to true if "new:true"  that means ex. price should remains the int not String

try{
    const tour=await Tour.findByIdAndUpdate(req.params.id,req.body ,{                                              
      new:true,runValidators:true
    })

  res.status(200).json({
    status: "success",
    data: {
      tour: tour
    },
  });

}catch(err){
   
  res.status(400).json({
    status:"fail",
    message:err
  })

}

 
};

exports.deleteTour = async (req, res) =>{
  try{
    const tour=await Tour.findByIdAndDelete(req.params.id,req.body)

  res.status(201).json({
    status: "success",
    data: null
  });

}catch(err){
   
  res.status(400).json({
    status:"fail",
    message:err
  })

}

 
};
