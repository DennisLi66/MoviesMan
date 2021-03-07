require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require('cookie-parser'); //FIX THIS: ADD COOKIES
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); //FIX THIS: ADD RECOVERY FOR PASSWORD

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

connection.connect();
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
    //VALIDATION - Make sure there are no other accounts that use this email.
    var email = req.body.email;
    var password = req.body.password;
    var cPassword = req.body.cPassword;
    var username = req.body.username;
    if (cPassword !== password){ //confirmation did not match
      res.redirect("/register"); //change to one with an error message ////////////////////FIX THIS
    }
    else{
      // console.log(req.body.email);
      // console.log(req.body.username);
      // console.log(req.body.password);
      var query1 = "SELECT username FROM users WHERE email = " + connection.escape(email);
      connection.query(query1,function(err,results,fields){
        if (err){
          console.log(err);
        }
        else{
          if (results.length > 0){
            res.redirect("/register"); // that account already exists //////////FIX THIS TO ERROR MESSAGE
          }
          else{
            var insertStatement = "INSERT INTO users (username,email,pswrd) VALUES (?, ?, ?)";
            bcrypt.hash(password, 10, function(e2rr, hash) {
                // Store hash in your password DB.
                if (e2rr){
                  console.log(e2rr);
                  res.redirect("/register");
                }
                else{
                connection.query(insertStatement,[username,email,hash],function(er1r,results,fields){ ///////FIX THIS ADD SALTING
                    if (er1r){
                      console.log(er1r);
                      res.redirect("/register"); //FIX THIS TO ERROR MESSAGE
                    }
                    else{
                      res.redirect("/login"); ///FIX THIS TO CONFIRMATION
                      }
                });
                }
            });
          }
        }
    })
    }
  });

app.route("/login")
  .get(function(req,res){
    res.render("login")
  })
  .post(function(req,res){
    var email = req.body.username;
    var password = req.body.password; 
    console.log(email);
    var sQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(sQuery,[email],function(eror, results, fields){
      if (eror){
        console.log(eror);
        res.redirect("/login");
      }
      else{
        if (results.length == 0){
          res.redirect("/login"); //FIX THIS ERROR MESSAGE
        }
        else{
          var resPass = results[0].pswrd;
          bcrypt.compare(password, resPass, function(err, rresult) {
              // result == true
              if (rresult){
                console.log(results[0].username + " logged in.");
                res.redirect("/login");
              }
              else{
                console.log("Logging in failed.")
                res.redirect("/login");
              }
          });
          //FIX THIS ADD COOKIES / AUTHENTICATION
        }
      }
    })
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
