var express = require("express");
var crypto    = require('crypto');
var app = express();
var path = require('path');
var http = require('http');
var bodyParser = require("body-parser");
var multer = require('multer');
var apiRouter = require("./routes/index");
var db = require("./models/index");
require("dotenv").config();
const cookieParser = require("cookie-parser");


app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Create Server
var server = http.createServer(app);


// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Cashfree PG simulator' });
});

// app.get("/",(req,res)=>{
//   res.status(200).json({message:"API Working"})
// })

app.use("/mechanic", apiRouter);

const DB_URL = "mongodb://localhost:27017/mechanic";

//const DB_URL = process.env.MONGO_URI

db.mongoose
  .connect(DB_URL)
  .then((data) => {
    console.log(`Mongodb connected with : ${data.connection.host} server`);
  })
  .catch((err) => {
    console.log("mongodb error", err);
  });

const port = process.env.PORT;
server.listen(port , ()=>{
    console.log(`Server is working on port : ${port}`)
})

