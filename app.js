require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
const cookieParser = require('cookie-parser');
const mysql = require('mysql');



const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: process.env.SECRET, //env variable
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const conn = "mongodb://" + process.env.HOST + ":" + process.env.PORT + "/" + process.env.DATABASE;

mongoose.connect(conn, {useNewUrlParser: true});
mongoose.set("useCreateIndex",true);
//can render between a logged in version and a logged out version
// will need to add if authenticated later on

//info should include username

//MONGOOSE
// const userSchema = new mongoose.Schema({
//   userid: Number, //corresponds with user counter
//   email: String,
//   username: String,
//   password: String
// });
//
// const likedMoviesSchema = new mongoose.Schema({
//
// });
//
// const ratingsSchema = new mongoose.Schema({
//
// });

//Home
app.get("/",function(req,res){ //ideally a homepage
  res.render("home");
});
app.get("/about", function(req,res){ //server information about this site in specifities
  res.render("about");
});
// Registration and Login
app.route("/register")
  .get(function(req,res){
    res.render("register")
  })
  .post(function(req,res){
    //validate username and password, then create an account
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(process.env.SECRET);
    res.redirect("/login");
  })

app.route("/login")
  .get(function(req,res){
    res.render("login")
  })
  .post(function(req,res){
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(process.env.SECRET);
    res.redirect("/login");
  })
// Search Information
app.get("/search",function(req,res){//search and search results
  console.log(req.query);
  if (req.query.length == 0){ //basic search page
      //authentication check
      res.serve("search");
  }
  else{
    if (req.query.title){
      console.log(req.query.title);
    }
    if (req.query.year){
      console.log(req.query.year);
    }
    if (req.query.act){
      console.log(req.query.act);
    }
    if (req.query.director){
      console.log(req.query.director);
    }
    //get movie api and serve it
    res.render("search");
  }
})
// Movie Page - IMDB Information, Reviews
app.get("/movie",function(req,res){ //redirect?
  res.redirect("/search");
})
app.get("/movie/:movieTitle",function(req,res){

})
// Profile Information - Liked Movies, Movie Reviews
app.get("/profile",function(req,res){ //maybe a place to search for profiles

})
app.get("/profile/:username",function(req,res){

})



app.listen(3000,function(){
  console.log("Server Started.")
});
