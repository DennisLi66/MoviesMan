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
