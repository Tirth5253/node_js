//===========================================HERE the actual Project Starts, impiment TOUR's ROUTE====================================================
const express = require("express");
const app = express();
const router = express.Router();
app.use("/api/v1/tours", router);                                                                       //here in this code we have made the router which we made a custom router for Tour data and then so we can use it all along the application that's why ,we have made it the "MiddleWare" and now instead of "app" we will use "router" and in the ".route" we only have to add those path remaining that comes after the "/api/v1/tours" ===> this process is called the "Mounting the router"

const tourController = require("./../controllers/tourController");                                      //now all the functions that are exported now in the "tourController"

//======for aggregation Pipeline's route=============

router.route("/tour-stats").get( tourController.getTourStats);
router.route("/monthly-plan/:year").get( tourController.getMonthlyPlan);

// router.param("id", tourController.checkID);                                                          //here is the another type of middleware that we can implement using the "checkID" in the tourController as a 2nd args, so this middleware will save us from writing the "id" validation code everywhere and also this works only for TOUR data bcse the middleware is in the tourController, when the program reaches this line it will then go to "checkID" in the tourController so there the our id validation occurs and then we returned the output acc. to that


// ==============================Aliasing in the API======================

router.route('/top-5-cheap').get(tourController.aliasTopTours ,  tourController.getAllTours)


router
  .route("/")
  .get(tourController.getAllTours)
  .post( tourController.createTour);                                          //here we have making the "middlware chaining" means that in the POST request first the "checkBody" middleware function will be get run and then further the code will proceeds

//==========================Responding to URL parameters means (when we hit '127.0.0.1:3000/api/v1/tours/1') it will gives us the first object
//========================================PATCH & DELETE METHOD===========================================================

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);



module.exports = router;
