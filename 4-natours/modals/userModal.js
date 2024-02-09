//here in this file just like tourModal we wiil writes the schema for the users 

const mongoose=require('mongoose');
const validator=require('validator');                                               //this is the package from the npm and by this we can validate like our Emails in proper format or not 
const { default: isEmail } = require('validator');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'tell us your name']
    },
    email:{
        type:String,
        required:[true,'Please provide your Email'],
        unique:true,
        lowercase:true,                                                            //by this all to converted to lower case like Tirth@Joshi==> tirth@joshi
        validate:[validator.isEmail,'please Provide a valid email'] 
    },
    photo:{
        type:String,
    },
    password:{
        type:String,
        required: [true,'please provide a password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please Confirm Your Password']
    }
});
const User=mongoose.model('User',userSchema);
module.exports=User; 