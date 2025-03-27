import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import {} from 'dotenv/config'

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
  const result =  await db.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]
  );
    console.log(result);
    res.render("secrets.ejs");
  });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("username is: ", username);
  console.log("password is: ", password);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
