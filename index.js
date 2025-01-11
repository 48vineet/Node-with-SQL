const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/vineet", (req, res) => {
  res.render("index");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Vineet@123",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = " SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result[0]["count(*)"]);
      res.send("success");
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
});

app.listen(port, (req, res) => {
  console.log(`app is listning on port : ${port}`);
});

// connection.end();
