// const fs = require("fs");
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`),
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`the tour id is ${val}`);                                                          //here is the another middleware function that we passes in the middleware that we have make to want to check if user has types the valid "id" or not and in this perticular middleware we have the 4 parameters and the 4th one is the  "val"  that contains the value of the "id" ,NOTE: you can have used the function and call in all the callbacks but that's the how the EXPRESS works in pipelines
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log("there is no name or price");                                                 //here is the middleware function that will be checking the "req.body" means the message send from the PostMan have "Name" or "Price" or not
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "No Name or Price",
//     });
//   }
//   next();
// };