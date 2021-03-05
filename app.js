require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

//can render between a logged in version and a logged out version
// will need to add if authenticated later on

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
  .post()

app.route("/login")
  .get(function(req,res){
    res.render("login")
  })
  .post()
// Search Information
app.get("/search",function(req,res){//search and search results

})
// Movie Page - IMDB Information, Reviews
app.get("/movie",function(req,res){ //redirect?

})
app.get("/movie/:movieTitle",function(req,res){

})
// Profile Information - Liked Movies, Movie Reviews
app.get("/profile",function(req,res){

})
app.get("/profile/:username",function(req,res){

})



app.listen(3000,function(){
  console.log("Server Started.")
});
