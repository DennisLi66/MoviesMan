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


//Home
app.get("/",function(req,res){ //ideally a homepage
  res.render("home");
});
app.get("/about", function(req,res){ //server information about this site in specifities

});
// Registration and Login
app.route("/register")
  .get()
  .post()

app.route("/login")
  .get()
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
