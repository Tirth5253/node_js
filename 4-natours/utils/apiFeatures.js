//here the main motive of this file is to make all the "making api better" feature function to reusable and make a seperate file
//so what we have done in this file ,we have make the one class named "APIFeatures" in that we have initialized the constructor
//that will pass the two variable "query" and "queryString" so in the "query" it will represents the "Tour.find()" and the "queryString" represents the "req.query" in the "TourController.js"
//and after that we have initialize that components by "this" keyword
//then we have defined the "filter()" method and that can represents the variables
//and also in all the methods we have returned the "this" so that reprents that all the whole object of that method is returned
//HOW TO INITIALIZE ===>   const features=new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate();       //here we have initialized the object and also reinitialized the object                                      
                      //   const tours=await features.query;                                                                         
//so here you can see that we have made the method chaining in the "APIFeature" and so our query's data will pass on all these functions and get modified one by one 
//then at last when all the modification will completeswe will save the final result in the "tours" by the "features.query" that means  "the last result of feature's .find() method result" 



class APIFeatures{                                                                     //here the this.queryString = {req.query} means the string from url
    constructor(query,queryString){
      this.query=query;
      this.queryString=queryString
    }
    filter(){
  
           //  1A.      ======Build Query & filtering=======
               const queryObj={...this.queryString};                                                                      //here we have created the "shallow Copy" of the "req.query" object by destruct. means if we make changes in the "queryObj" then it will not affects the "req.query" WHY WE NEED ==> suppose we have a query in the header like   "127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy&page=2"   so here we can see that "page" is the pagination object so it needs in the pagination   means it will be not in the database so we may nedd to update "req.query" thats why                 
               const excludedFields=['page','sort','limit','fields'];                                             //this is the fields that we want to remove from our querObj so we can have only purely "req.query" elements
    
               excludedFields.forEach(el=>delete queryObj[el]);                                                   //here is the function that we have made using the "for each" bcse we don't want to create a new array so the "excludedFields" will be deleted from the "queryObj"
  
         //1B.  ===================ADVANCE FILTERING===================================
                                                                                                 //so what is advance filtering called so lets take example we want to type query in the header of the postman like this "127.0.0.1:3000/api/v1/tours?duration[lte]=5&difficulty=easy" so this says that we want the duration that is less than 5 so if want to type query in the magoose that will be like this  "{ duration: { $lte: '5' }, difficulty: 'easy' }" and if you concole it the terminal says the "{ duration: { lte: '5' }, difficulty: 'easy' }"  so there is only a difference of the "$" in both so we will add the "$" in the "req.query" so we can execute it like the mongoose query
              let querystr=JSON.stringify(queryObj);
              querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);                      //so here we have writen the code of the replacement in replace the code written "//" called the regulare exprassion and the "\b" is used to replace the string that only consists "lte" like the words means word like "mnlte" will not replaced,and the "/g" will replaces these words at all the where not the first time and theres the second argument is callback function that will replaces the match ==> $match means lte ===> $lte
              console.log(JSON.parse(querystr))                                                          //here we have again converts the string to "JSON object"
  
              this.query=this.query.find(JSON.parse(querystr))
              // let query=Tour.find(JSON.parse(querystr));                                                          //why we use the "await" here later ,bcse if you use query "Tour.find(queryObj)" directly in the await then we have no chance to edit further Ex. if i want to add the methods like the "page" "linit" etc bcse once we writes the await then the data will get send there is no scope of the editing, thats wht we use a variable "query" to store that data before it goes to await,and here we have defined the "query" by let so later we can change it
             return this;                                    //by 'this' we have returned the entire object 
    }
  
    sort(){
  
                  //2.    ===================== Sorting ====================
  
                        if(this.queryString.sort){
                          const sortBy=this.queryString.sort.split(',').join('  ');                                        //this is the query when there is a tie b/w the prices than they will be ranked in terms of the ratingsAvereage,this line will make our types this "-price,ratingsAverage" to like this that mongoose can understand "-price ratingsAverage"
                           console.log(sortBy);
                          this.query=this.query.sort(sortBy);
                         }else {
                         this.query=this.query.sort('-createdAt')
                      }
                      return this;
  
    }
  
   limitFields(){
       
                  //3.  ==================Field Limiting====================
                                                                                             //here the fields limiting means that the user only wants the certain fields ex "127.0.0.1:3000/api/v1/tours/fields"
                         if(this.queryString.fields){
                              const fields=this.queryString .fields.split(',').join(' ');
                                    this.query=this.query.select(fields) 
                         }else{
                               this.query=this.query.select('-__v')
                              }
                              return this;
  
   }
  
   paginate (){
       
           //4.   ==============Pagination==============
  
      //page=2 & limit=10                                                           //so this below line says that we have 10 entries per page and we want to go on the second page then we have to skip 10 pages to reach the 2nd page so the below "query" is the to reach at the second page if you want to go 4th page then the code will be "skip(30).limit(10)"
         const page=this.queryString.page*1 || 1;                                               //here in this line we have defined the default value of the page means if we have 1000 entries and user has not defined the page then it will not shows the 1000 entry in 1 page means it will by default shows page no. 1, here we have made the string of the user input(query.page) by mul. 1 and writes the ogic that if user has not defined the page then make page by default 1
         const limit=this.queryString.limit* 1 || 100;  
         const skip=(page-1)*limit;
         this.query=this.query.skip(skip).limit(limit) 
    
        //  if(this.queryString.page){
        //   const numTours=await Tour.countDocuments();                                 //here the ".countDocuments()" will return a promise thats why we have use the "await"  , and this logic will be used if our entries will fell short in front of pages
        //   if((skip)>=numTours) throw new Error(' this page does not exist')
        //  }
        return this;
  
   }
  
  }
  module.exports=APIFeatures;





  // //2.    ===================== Sorting ====================

// if(req.query.sort){
//   const sortBy=req.query.sort.split(',').join('  ');                                        //this is the query when there is a tie b/w the prices than they will be ranked in terms of the ratingsAvereage,this line will make our types this "-price,ratingsAverage" to like this that mongoose can understand "-price ratingsAverage"
//   console.log(sortBy);
//     query=query.sort(sortBy);
// }else {
//   query=query.sort('-createdAt')
// }


// //3.  ==================Field Limiting====================
//                                                                                            //here the fields limiting means that the user only wants the certain fields ex "127.0.0.1:3000/api/v1/tours/fields"
// if(req.query.fields){
//   const fields=req.query.fields.split(',').join(' ');
//   query=query.select(fields) 
// }else{
//   query=query.select('-__v')
// }

// //4.   ==============Pagination==============

//     //page=2 & limit=10                                                           //so this below line says that we have 10 entries per page and we want to go on the second page then we have to skip 10 pages to reach the 2nd page so the below "query" is the to reach at the second page if you want to go 4th page then the code will be "skip(30).limit(10)"
//        const page=req.query.page*1 || 1;                                               //here in this line we have defined the default value of the page means if we have 1000 entries and user has not defined the page then it will not shows the 1000 entry in 1 page means it will by default shows page no. 1, here we have made the string of the user input(query.page) by mul. 1 and writes the ogic that if user has not defined the page then make page by default 1
//        const limit=req.query.limit* 1 || 100;  
//        const skip=(page-1)*limit;
//        query=query.skip(skip).limit(limit) 
  
//        if(req.query.page){
//         const numTours=await Tour.countDocuments();                                 //here the ".countDocuments()" will return a promise thats why we have use the "await"  , and this logic will be used if our entries will fell short in front of pages
//         if((skip)>=numTours) throw new Error(' this page does not exist')
//        }
