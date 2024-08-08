//===================for the theory of the token, jwt and the signature go to lecture 128=========================
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../modals/userModal");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const cookieOptions = {};

const signToken = (id) => {
  //token function so we can reuse it more
  return jwt.sign(
    {
      //here we have made the token using the "jwt.sign()" method means "jwt's Signature" method, so this method accepts two arguments as compulsary , the first is "payload" means the data we want to send along with the signature and the second is the "secret String" that we can defign in our .env file  and that string should be 32 character long so it can easily  encode it by SHA 256,, ok so the third argument is options and it will haves the additional data like in how much time the json web token expires or how long its valid , and it is generally defines in object form,  and that is how the logging in  of the user will get start means this token will be sent to the user and, and user end will somehow stores that token to use it  , now if you creates the user by the post method then it will also retuns the token
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name, //here we have written the manually fields not directly ==>"req.body" bcse in that user can have access to register himself as a "Admin" by define role in the body of the poatman so here we write it manually so only these fields can be filled, if user tries to manually add the role he can not add to the database
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);
  console.log(token);

  //======sending the JWT via  cookie==========>>>>

  res.cookie("jwt", token, {
    //her the 2nd argument is token then, in third our validation starts the expires will basicslly checks if its expired or not, the expiration is from the now to 90 days later the secure true will do that the cookie will only be sent to the encrypted connection, and httpOnly true means by this the cookie cannot be used or modified by the browser
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure:true,
    httpOnly: true,
  });

  res.status(201).json({
    status: "success",
    token: token,
    data: {
      user: newUser,
    },
  });
});

//=========================================IMPLEMENTING LOGIN LOGIC============================================

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1). CHECK IF EMAIL AND PASS. EXIST OR NOT
  if (!email || !password) {
    return next(new AppError("Please Provide Email and Password", 400));
  }

  //2). CHECK IF USER EXISTS && PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select("+password"); //here we have used the .select method==> reason is that we have added the property "selected:false" so the user can't have the password , so we have to use it explicitly like this to get password to check the condition , here we have used "findOne" to find the user on the basis of the "email" so it exists or not
  //   const correct= await user.correctPassword(password, user.password);                   //this will give either true or the false ,  the second argument will password of the User in the database and the first one is the client means tries to login

  if (!user || !(await user.correctPassword(password, user.password))) {
    //here we have commented the "correct" variable bcse if the "user" is not available then still correct will run so we don't want that , the "correctpasswod" is the global method that we have wriiten in the "userModal"
    return next(new AppError("Incorrect email or password", 401));
  }
  //3). IF EVERYTHING OKAY , SEND TOKEN TO CLIENT
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    //her the 2nd argument is token then, in third our validation starts the expires will basicslly checks if its expired or not, the expiration is from the now to 90 days later the secure true will do that the cookie will only be sent to the encrypted connection, and httpOnly true means by this the cookie cannot be used or modified by the browser, //in this the secure true means the cookie will only be send to the secure connection means the https only connection, right now we are using hte postman so we are commenting it , // this is the inpoerant to prevent cross site attacks , by this it will store the cookie then send it automatically along with the every request., so if you are using he production dev then use the secure:True
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure:true,
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    token,
  });
  next();
});

//=======================================MIDDLEWARE FUNCTION FOR PROTECTED ROUTES==================================
//here this section means that we will implement that kind of middleware that will only give access to the login users to access "getAllUsers"  or tours
exports.protect = catchAsync(async (req, res, next) => {
  //1). Getting Token and Check of It's there or Not (exist or not )
  //what happens in this ===> so we can extract or lets say get all the headers from the postman by "req.headers" so this will gives the full list of the headers in that  our main thing is in the "authorization" header as we know that it's value start with the "Bearer" and then space " " and then our token
  let token; //here we have globally defined the token so we can later use it any where
  if (
    //here we have written the logic that if there is authorization header and also in that it starts with "Bearer"  here startsWith() is method which gives boolean if string starts with the argument in that and if both condition mets true then we extract the token from the authentication
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //here the [1] shows that we want the second element in the splited array
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError("Your are not logged in! please login to get access", 401),
    );
  }

  //2). Varification of the Token IMP [Where JWT algorith will varifies If signature(token) is valid or Not or someone has manipulated it or not or it is expired or not]

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //here we have used the "promisify" function that is in the "util" library so the main use of its is used in async functions so by using that we do not have to write the callback function as in the "jwt.verify" have third args. as callback function  ==> here if we console lof the decoded then it would give three items and one of them is id of the user , here the main object of the "verify" method is to verify and see that token or payload[here ID] is actually tempered or not

  //3). Checks if the user Is sill exists or Not                                                        //here we again checks for the user still exists or not bcse what if in the mean time the user got removed or get deleted  so this step is also essential , bcse token is still exist but user may be get deleted or removed from DB or User have chnaged the password after the token assign to him ==> this step is essential in if the assigned token of the user may get stealed or exposed so for safety the user wanted to changes the password then by this step the user's stolen token is not valid  ===> so in short we checks that payload id in the token matches the id of the user or not

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    //if the id tempered then we can not gets the currentUser by that id in the database
    return next(
      new AppError("The User belong to this token does not longer exists", 401),
    );
  }

  //4). Check if user Changed the Password after the TOKEN is assigned

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    //here "iat" means issued at , for this method explaination go to the changedPasswordAfter method in modal
    return next(
      new AppError(
        "User Recently changed the password ! please login again",
        401,
      ),
    );
  }

  req.user = currentUser; //here as we can know that if you want to pass data from one middleware to another middleware then we have to pass that data into the "req" , here if the user is requested then it will recieves the "currentUser" means the user finded from the databse by id in the token payload
  //if this all the condition will satisfies then our next() will get called means getAllTours will executes
  next();
});

//=======================================AUTHORIZATION [Role based]===================================================

exports.restrictTo = (...roles) => {
  //NOTE: here as we know that we have to pass the roles like "admin, lead-guide" in the midd. function but the midd. function cannot accepts the any argument so we have return the middleware function in return statement , also here "...roles" is not role in the schema this is the "admin, lead-guide" passed inthe method in the tourModal so we store all of them in the array by rest op.===>so after that we already have passed the "req.user=currentUser" in the "prevent" middleware so this middlware function can use it to check that its role[user that logged [currentUser]]is matches with the [roles] array or not
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission To perform this action", 403),
      );
    }
    next();
  };
};

//==========================================FORGOT PASSWORD====================================================

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1). Get user On the Base of Posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user With that email", 404));
  }

  //2). Generate the Random Token so can recieves in mail and send back so he can reset pass.
  const resetToken = user.createPasswordResetToken(); //this will contains the token as we have returned in instance method
  await user.save({ validateBeforeSave: false }); //in the createPasswordResetToken method we have modified the code but didn't saves the , so we did it and also typed "validateBeforeSave: false" so we don't need to add other fields like name email etc for this to save

  //3). Send It [resetToken] back To the user's email
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a Patch request with your new password and passwordConfirm to:${resetUrl}.\n .\n If you Didn't forget your password,  Please ignore this email!`;

  try {
    await sendEmail({
      email: user.email, //or req.body.email
      subject: "Your password reset Token(Valid for 10 min.)",
      message,
    });
    res.status(200).json({
      status: "suceess",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        `There was an Error Sending the email. Try again later ${err}  `,
        500,
      ),
    );
  }
});

//==========================================RESET PASSWORD=====================================================

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1). Get User Based on the Token                                                     //here we have the encrypted resetToken in the database so , compare the this reset token with our In the database we have to also encryprt the Returned Token so we can Compare
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex"); //here in this we have encrypted the token ==> means when the user will get the token via the email , then he would paste the token into the url as token parameter like this "'/resetPassword/:token'"
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }); //here the token provided using the req.param by that we find the user and also , we checks "passwordResetExpires" propery that it expired or not compare to today's date

  //2). If Token Has not Expired and There is a user, then set New Password
  if (!user) {
    return next(new AppError("Token is Invalid or has expired", 400)); //if token is expired or invalid tokne then Error
  }

  user.password = req.body.password; //if user is good then password&all things will be be changed and at the end after the change there is have to be a save
  user.passwordConfirm = req.body.passwordConfirm; //and in this we do not have to turn off the validators propery bcse we want that there is validation b/w pass conf. and pass .
  user.passwordResetToken = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  //3). Update the changedPasswordAt property in the DB                                    //for this checks the useModal

  //4). Log the User In, Send the json Web Token to the client
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    //her the 2nd argument is token then, in third our validation starts the expires will basicslly checks if its expired or not, the expiration is from the now to 90 days later the secure true will do that the cookie will only be sent to the encrypted connection, and httpOnly true means by this the cookie cannot be used or modified by the browser
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure:true,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

//==============================UPDATE THE CURRENT USER PASSWORD(without forgetting  the pass)======================

exports.updatePassword = catchAsync(async (req, res, next) => {
  //this password update functionalities is only for the logged in users, here we cannot use the approach of the "findbyIdandUpdate" bcse the "passwordConfirm" will not run at the "update"

  //1). Get the user from the collection
  const user = await User.findById(req.user.id).select("+password"); //here the user is already logged in so we can have its all info. in the req.user ==> and also we are using "protect" middleware before this middleware so , you have to log in so when you log in your token will get saved to the environment

  //2). Check if Posted Current Password is Correct                                                  //this is for the security measure that , the prev. password confirm
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError("there is no account found with that password", 400),
    );
  } //here we have compared the user typed password and user database's password

  //3). If, so Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4). Logg the user in, Send the JWT
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    //her the 2nd argument is token then, in third our validation starts the expires will basicslly checks if its expired or not, the expiration is from the now to 90 days later the secure true will do that the cookie will only be sent to the encrypted connection, and httpOnly true means by this the cookie cannot be used or modified by the browser
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // secure:true,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
