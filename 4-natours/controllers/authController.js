
const User=require('./../modals/userModal');
const catchAsync=require('../utils/catchAsync');               


exports.signup=catchAsync(async(req,res,next)=>{
     const newUser= await User.create(req.body);                                                                 //means the users will be creating using the body of the postman 
     res.status(201).json({
        status:'success',
        data:{
            user:newUser
        }
     })
    });