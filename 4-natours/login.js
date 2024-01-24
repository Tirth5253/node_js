const express = require("express");
const app = express();
app.use(express.json());

const port = 7000;

app.get("/api/v1/login", (req, res) => {
  console.log("Login GET");
  res.status(200).json({
    message: "this is Login",
  });
});

app.post("/api/v1/login", (req, res) => {
  console.log("This is Post Login");
  console.log(req.body);
  res.status(200).json({
    message: "message sent",
  });
});

app.listen(port, () => {
  //here in the express we have some similarities like "http" server
  console.log(`App running on port ${port} .....`);
});
