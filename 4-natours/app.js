const express=require('express');
const fs=require('fs');
const app=express();

app.use(express.json());                                                                       //this line tells about the middleware, middleware will be stands between request and responce to modify data,for "POST" method we will need the Middlware ,more on the middleware in next lectures, in middleware the request will be passes through, if you cannot uses the middleware then you cannot sees the json data in the vs code terminal that we have send from the postMan's body   ,,here the "use" method is used to add the middleware in the middleware Stack






//===============================================CREATING OUR OWN MIDDLEWARE===========================================

app.use((req,res,next)=>{                                                                      //here in this section we makes our own middleware..there is middleware STACK between every request and responce,so every request passes through vareius and many middleware ,and that middleware makes changes according to their code , and to jump from one middleWare to another there is a function "NEXT" at last of the every middlewares here we have also the third argument as a "next" you can name anything you want, here you have to be carefull with the order of the code of the middleware bcse if you defines it bottom we will not get any message from middleware bcse  it will sends the message to all the HTTP methods that are below to it
    console.log("Hello from the middleWare 🖐🏽");
    next();                                                                                     //IF we don't use the "next()" then our Req. Res. will get stuck and user will not get any messages
 })
 
 
app.use((req,res,next)=>{
    req.requestTime=new Date().toISOString();
    next();
})



                    // =======GET method ===========
// app.get('/',(req,res)=>{
//     res.status(200).json({message:"Hello this is from the server side", app:"Natours" });                                  //here this line determines the routing in the express means for which route we will show which data, so expressVariable.method here it is GET and then in that get method there is two arguments,first one is the path and the second one is the callback function

// })                                                                                              //for sending the message to the client side we have ".send()" method and also you can send the "json()" method to send the json data.., to define the status code we have ".status()"

//                 =========== POST method ==========
// app.post('/',(req,res)=>{
//     res.send("you can post this endpoint .....")                                            //here it is the "POST" method means the 
// })

//================================HERE WE HAVE MADE THE all CALLBACKS SEPERATELY so later we export===============================

// =============GET ALL TOURS=================
const getAllTours =(req,res)=>{
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
  const getTour = (req,res)=>{                                                    //here in this line in the first argument we have defined the ":id" by that we have created the variable/Parameter called "id" it can be anything ,further in console we can get that variable value that we can type in the postMan header like "127.0.0.1:3000/api/v1/tours/5" will gives { id: '5' } bcse of "req.params" and if you have this in GET "'/api/v1/tours/:id/:x/:y" and you write this in header of the Postman will then console will gives this "{ id: '5', x: '45', y: '30' }", if they have the "?" after then they are the optional
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
  
  const createTour = (req,res)=>{
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
  
  const updateTour = (req,res)=>{
    res.status(200).json({
     status:'success',
     data:{
         tour:'<Updated Tour here......>'
     }
    })
 }
  
  const deleteTour =  (req, res) =>{
    res.status(204).json({
        status:'success',
        data:null
    })
}







//===========================================HERE the actual Project Starts====================================================

const tours=JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours',getAllTours);

app.post('/api/v1/tours',createTour)

//==========================Responding to URL parameters means (when we hit '127.0.0.1:3000/api/v1/tours/1') it will gives us the first object
 
app.get('/api/v1/tours/:id',getTour)

//========================================PATCH METHOD===========================================================


app.patch('/api/v1/tours/:id',updateTour);

//====================================DELETE METHOD=========================================================

app.delete("/api/v1/tours/:id",deleteTour)












const port=3000; 
app.listen(port,()=>{                                                                      //here in the express we have some similarities like "http" server
    console.log(`App running on port ${port} .....`);
});
