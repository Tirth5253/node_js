const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
  connectionLimit: 10,
});

pool.query("select * from login", (err, result, fields) => {
  if (err) throw err;
  console.log(result);
});
