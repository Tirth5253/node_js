const express=require('express');
const app=express();
const userController=require('./../controllers/userController')
const authController=require('./../controllers/authController')

//=======================================IMPLEMENTING 'USERs' ROUTES==============================================
const router=express.Router();

router.post('/signup',authController.signup)

router.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports=router;