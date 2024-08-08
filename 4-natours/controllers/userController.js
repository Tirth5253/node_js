//==========================================USER ROUTE's CALLBACKs=================================================

const User=require('../modals/userModal');
const APIFeatures=require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync=require('../utils/catchAsync');     


exports.getAllUsers= catchAsync(async(req,res,next)=>{
    const users=await User.find();                                                                         
  
    // =====sends responce===
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { 
        users,
      },
    });
})

//===========================================Update data of Log in User======================================================

exports.updateMe=catchAsync(async(req,res,next)=>{
    //1). create Error when user tries to POST, Password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError("This route is not for the password Updates, please use '/updateMyPassword' ",400))
    }

    //2). Filterout the unrequired fields
       const filteredObj=(obj,...allowedFields)=>{                                                       //here we have made the function that is used to filter out the data from the body of the postman and will gives only selected data ("like name, email") so user can't have the sensitive fields like the "role" etc
          const newObj={};
          Object.keys(obj).forEach(el=>{                                                                //object.keys will give all the keys of the object
            if(allowedFields.includes(el)){
                newObj[el]=obj[el]
            }}

            )
            return newObj;
       }
    //3). Update the User Document 
       const filteredBody=filteredObj(req.body,'name','email');
       const updatedUser=await User.findByIdAndUpdate(req.user.id, filteredBody,{                                     //unlike in the "updatePassword" here we have used the "findbyIdAndUdate" bcse here we want only selected fields and also , don't want to affect the other fields 
        new:true,
        runValidators:true
       })


    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }

    })
})



//============================================User DELETING the himself==========================================
                                                                                                            //in this we basically not deletes the user from the data Base we just basically InActive the user

exports.deleteMe=catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
        status:'success',
        data:'null'
    })
}
)



exports.getUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
}

exports.createUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
}

exports.updateUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
} 

exports.deleteUser=(req,res)=>{
    res.status(500).json({
        status:'error',
        message:"This route is not yet defined"
    })
}
