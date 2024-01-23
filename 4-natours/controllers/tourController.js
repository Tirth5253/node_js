//HERE WE HAVE MAKE THE ROUTE CONTROLLERS MAENS THE CALLBACK IN A SEPERATE FILE AND NAMED "CONTROLLERES" BCSE OF THE "MVC" ARCHITECTURE
//we also have "exports." before all the functions bcse we will export all of them so we can use them in the other file means "tourRoutes"

const fs=require('fs');
const tours=JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));

exports.checkID=(req,res,next,val)=>{
    console.log(`the tour id is ${val}`);                                                     //here is the another middleware function that we passes in the middleware that we have make to want to check if user has types the valid "id" or not and in this perticular middleware we have the 4 parameters and the 4th one is the  "val"  that contains the value of the "id" ,NOTE: you can have used the function and call in all the callbacks but that's the how the EXPRESS works in pipelines
    if(req.params.id*1>tours.length){
        return res.status(404).json({
            status:"fail",
            message:'Invalid ID'
        })
    }
    next();
}

exports.checkBody=(req,res,next)=>{
    console.log("there is no name or price")                                                //here is the middleware function that will be checking the "req.body" means the message send from the PostMan have "Name" or "Price" or not
    if(!req.body.name || !req.body.price){                 
        return res.status(400).json({
            status:"fail",
            message:'No Name or Price'
        })
    }
    next()
}

//================================HERE WE HAVE MADE THE all TOUR's CALLBACKS SEPERATELY so later we export===============================

// =============GET ALL TOURS=================
exports.getAllTours =(req,res)=>{
    console.log(req.requestTime)
    res.status(200).json({
        status:'success',
        requestedAt:req.requestTime,
        results:tours.length,
        data:{
            tours
        }
    })
}
 
//=============================GET callback by ID==================
exports.getTour = (req,res)=>{                                                    //here in this line in the first argument we have defined the ":id" by that we have created the variable/Parameter called "id" it can be anything ,further in console we can get that variable value that we can type in the postMan header like "127.0.0.1:3000/api/v1/tours/5" will gives { id: '5' } bcse of "req.params" and if you have this in GET "'/api/v1/tours/:id/:x/:y" and you write this in header of the Postman will then console will gives this "{ id: '5', x: '45', y: '30' }", if they have the "?" after then they are the optional
    console.log(req.params);

    const id=req.params.id*1;                                                               //here we have converted our id into the string by multipling the string bcse for comparision in the "find" we want strings in both side
    const tour=tours.find(el=> el.id===id)                                                                 //in this line we have used the "find()" method to array in which we passes the  callback function ==> so it will basically loop throughs the array and each of the iterations we will have access to "el" means for each eterations the logic condition "el===req.params" will be checked, so find method will create an arrays that only contains the element where where logic will gets the true
    res.status(200).json({
        status:'success',
        data:{
            tours:tour
        }
    })
}

//=========================PATCH callback================================
  
exports.createTour = (req,res)=>{
    // console.log(req.body)                                                               //here in the post request we uses the "req" more. here the 'body' is available in the postman bcse of the middleware
    
   const newId=tours[tours.length-1].id+1 ;                                               //here we have created the code for generating the new or latest id for our latest object to get add
   const newTour=Object.assign({id:newId},req.body);                                      //so in this line we merge two objects to fit our new id in the data of body of postman, for tha we have used "Object.assign()"=> that is the method to merge the two objects to create one new, here in the assign() method the second argument is the "req.body" means it is the message or the data that we types in the "PostMan"'s body and we uses it here

   tours.push(newTour); 
                                                                                         //now by this file we have mergerd or push the new object of "newTour" so the tours is ready to updated in our actual file
   fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
    res.status(201).json({                                                              //in this code once we updated the array called "newTour" then we write it in the file , then further code says that we have send it to the client so in postman we can see that
        status:"success",
        data:{
            tour:newTour
        }
    })
   });

    // res.send('Done');                                                                    //we always need to send back something bcse the have to complete cycle of req-res
}  
  
exports.updateTour = (req,res)=>{
    res.status(200).json({
     status:'success',
     data:{
         tour:'<Updated Tour here......>'
     }
    })
 }
  
 exports.deleteTour =  (req, res) =>{
    res.status(204).json({
        status:'success',
        data:null
    })
}

