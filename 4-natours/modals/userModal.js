//here in this file just like tourModal we wiil writes the schema for the users 

const mongoose=require('mongoose');
const validator=require('validator');                                               //this is the package from the npm and by this we can validate like our Emails in proper format or not 
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
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
        minlength:8,
        select:false                                                            //by this line we can set that if user will get the token or any data when he hits the post/get request then , the password is not visible to him in the responce in like get all the users etc even, the password is encrypted this is bad practice , 
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please Confirm Your Password'],
        validate:{                                                                 //here we have made the custom validator for the PasswordConfirm means the function to check that if our entered password in the "confirmPassword" field can matches the password field
             validator : function(el){                                            // here we have not used the arrow function bcse we have to use the "this" keyword 
                  return  el===this.password;                                          //if this condition will falll false then the validation error will get occurs NOTE:==> this is only work on the save  and on create not on update means if you update the password then this condition will not exe., means this condition will only matches when we saves , here this will refers to the current document 
             },
             message:"PassWords are not the same"
        }
    },
    passwordChangedAt:{
        type:Date
    },
    role:{
        type:String,
        enum:['admin','guide','lead-guide','user'],
        default:'user'
     }
    ,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }

});

//==============================================PASSWORD Encryption=================================================

userSchema.pre('save',async function(next){                                              //here we have used the "document middleware" and even in that we have used the "pre" hook and the event is "save" means ===> this all means that our encryption that we write in function will be implimented between the getting the data and Saving it to the database
     if(!this.isModified('password')) return next();                               //here "isModified()" is the method of mongoose that will tell us what is modified and here we have written that , if there is not any modification on the password then nothing to do, but if modification on the password then we run the hashcode
     
     this.password= await bcrypt.hash(this.password,12);
     this.passwordConfirm=undefined;                                                //so here we have writen the logic===> that means that we just don't want to store the "passwordConfirm" to be store in the database , means its only purpose is that it just give the validation puropse ===> Now you wonder that we have wriiten required in front of the passwordConfirm but its required as a input not to be store in the database
     next();
    });

//
//=============================================PASSWORD CHECKING===============================================================
                                                                                          //here in this section we checks the password at the login time that it matches in the user database or not so==> we already know that we have encryted the password means our 'pass1234' will look like this "$2a$12$l4klU1hL.i4IU6ujbWCJZ.c/4e./LYW6z4FZp8JvyS6JYCYdDY1aS" so how we compares it? ===> simply we will also encrypt the entered password of the user also and then that encrypted password we will matches with encrypted pass. that lies in the database.
userSchema.methods.correctPassword= async function(candidatePassword,userPassword){               //here we have made the instance method means it will applies to all the documents, so no need to export it 
    return await bcrypt.compare(candidatePassword,userPassword);
 
}

//=====================================Checks Password is changed or not after Token Ass.============================= 

userSchema.methods.changedPasswordAfter=function(JWTTimestamp){                                   //here JWTTimestamp is the propery of the JWT that says the time of the token assignation , and this is also the instance method 
    if(this.passwordChangedAt){
        const changedTimeStamp=parseInt(this.passwordChangedAt.getTime() /1000 , 10);                                  //here we have converted the "passwordChangedAt" from look like this "2019-3-21" to time ==> "4838328" so we can compares it to the JWTTimestamp and so divided by 1000 so it give in seconds in ms.
        console.log(changedTimeStamp,JWTTimestamp);
        return  JWTTimestamp<changedTimeStamp ;                                                 //here this says that if our password is changes after token assignation then the "changedTimeStamp" (time when password changes ) is greater  >   </changedTimeStamp>  then "JWTTimestamp" [time  when token assigned] , so this will returns the true means password chnages after the token assignation
    } 
    
    //false means not changed
    return false; 
}

//=================================Instance method for Random Token for Forgot Pass.=================================

userSchema.methods.createPasswordResetToken=function(){
           const resetToken=crypto.randomBytes(32).toString('hex');
         this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');               //these all crypt op. bcse we have to store token as encrypt format to db so later we can compare it when user sends us the plain token so we will again do this and compare  
         console.log({resetToken},this.passwordResetToken);
         this.passwordResetExpires=Date.now()+10*60*1000;                              //10 min. valid      

             return resetToken;                                                           //this plain token used to send to user , and the passwordResetToken is basically encrypted "resetToken" means this will stored into the database that why we encrypted it so its use is when the user sends us the reset token that he recieved into the mail we checks that we do encryption of the use send token and then we compare it to the one we have in the DB
        }


//=========================Update the changedPasswordAt property in the DB For Password Reset============================

userSchema.pre('save',function(next){
    if(!this.isModified('password')|| this.isNew)return next();
    this.passwordChangedAt=Date.now() - 1000;                                //here we have used the '-1000' means we subtract the 1 sec. into passwordChangedAt bcse some time the thing happens that "passwordChangedAt" value will assign very late than the "JWT TOKEN TIME STAMP" so if that happens the our upper "changedPasswordAfter" middleware will throwa the error 
    next();

})

//========================================Delete Me, inactive the User====================================================

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next()
});

const User=mongoose.model('User',userSchema);
module.exports=User; 