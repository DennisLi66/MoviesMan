require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//GET ROUTES

app.get("/",function(req,res){ //ideally a homepage

});

app.post("/",function(req,res){
  
})

app.get("/register",function(req,res){ //serve a registration page

});

app.get("/login", function(req,res){ //serve a login page

});

app.get("/about", function(req,res){

});

//POST ROUTES
