const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require("method-override");
const express = require("express");  
const app = express();  
const port = 3000;  
  
app.use(methodOverride("_method")); 
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "/views")); 

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

//its for my home route

app.get("/", (req, res) => {
  let q = " SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
});

// for show users route
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
});

// for Edit Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id='${id}' `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      let user = result[0];
      console.log(user);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
});

// For Update (DB ) Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  console.log(newUsername);
  let q = `SELECT * FROM user WHERE id='${id}' `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("WRONG PASSWORD");
      } else {
        let q2 = ` UPDATE user SET username='${newUsername}' WHERE id='${id}' `;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some err in DB");
  }
});

app.listen(port, (req, res) => {
  console.log(`app is listning on to the port : ${port}`);
});
