import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import {} from 'dotenv/config';
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: `${process.env.DATABASE_USER}`,
  host:`${process.env.DATABASE_HOST}`,
  database: `${process.env.DATABASE_NAME}`,
  password:`${process.env.DATABASE_PASSWORD}`,
  port: `${process.env.DATABASE_PORT}`,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const checkUser = await db.query( "SELECT * FROM users WHERE email=$1", [email]);
    if (checkUser.rows.length > 0){
      res.send("User already exists. Try logging in.");
    } else {
       await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]
      );
      res.render("secrets.ejs");
    }
  } catch (err) {console.log(err)};
  });

app.post("/login", async (req, res) => {
    const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
