require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require('cookie-parser'); //FIX THIS: UPDATE COOKIES ON VISITING SITES
const mysql = require('mysql'); //FIX THIS: Maybe only open connections in functions, then close them immediately
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer'); //FIX THIS: ADD RECOVERY FOR PASSWORD
const randomatic = require('randomatic');
const imdb = require('imdb-api');
//FIX THIS - ADD MOST LIKED MOVIES, MOST HIGHLY RATED AMONG USERS

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE})
connection.connect(); //FIX THIS MOVE CONNECTIONS TO INSIDE SQL CALLS
//FIX THIS: KILL TEMPOARY COOKIES
//Home //FIX THIS IF AUTHENTICATED REFRESH SESSION
app.get("/",function(req,res){ //FIX THIS TO MAKE MORE LIKE A HOMEPAGE
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      res.render("home",{hiddenOUT: 'hidden', hiddenIN: ''});
    }
    else{
      console.log(req.cookies.userData.name + " is currently logged in.");
      res.render("home",{hiddenIN: 'hidden', hiddenOUT: ''});
    }
  }
  else{
    console.log("Anon User");
    res.render("home",{hiddenOUT: 'hidden', hiddenIN: ''});
  }
});
app.get("/about", function(req,res){ //FIX THIS TO ACTUALLY DESCRIBE THE SITE
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      res.render("about",{hiddenOUT: 'hidden', hiddenIN: ''});
    }
    else{
      console.log(req.cookies.userData.name + " is currently logged in.");
      res.render("about",{hiddenOUT: '', hiddenIN: 'hidden'});}
  }
  else{
    console.log("Anon User");
    res.render("about",{hiddenOUT: 'hidden', hiddenIN: ''});
  }
});
// Registration and Login
app.route("/register")
  .get(function(req,res){
    if (req.cookies.userData){
      if (req.cookies.userData.temporary){
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
        res.render("register",{errorMsg:'', hiddenOUT: 'hidden',hiddenIN:'',errHidden:'hidden'});
      }
      else{
        console.log("User is already logged in! Redirecting...")
        res.redirect("/");
    }
  }
    else{
      res.render("register",{errorMsg:'', hiddenOUT: 'hidden',hiddenIN:'',errHidden:'hidden'});
        }})
  .post(function(req,res){
    var email = req.body.email;
    var password = req.body.password; //FIX THIS: Add checking against a regex to keep password complicated
    var cPassword = req.body.cPassword;
    var username = req.body.username;
    if (cPassword !== password){ //confirmation did not match
      res.render("register",{errorMsg:"The passwords did not match.", hiddenOUT: 'hidden',hiddenIN:'',errHidden:''});
    }
    else{
      var query1 = "SELECT username FROM users WHERE email = " + connection.escape(email);
      connection.query(query1,function(err,results,fields){
        if (err){
          console.log(err);
          res.render("register",{errorMsg:err, hiddenOUT: 'hidden',hiddenIN:'',errHidden:''});
        }
        else{
          if (results.length > 0){
            res.render("register",{errorMsg:"An account using that email already exists.",hiddenOUT: 'hidden',hiddenIN:'',errHidden:''});
          }
          else{
            var insertStatement = "INSERT INTO users (username,email,pswrd) VALUES (?, ?, ?)";
            bcrypt.hash(password, 10, function(e2rr, hash) {
                // Store hash in your password DB.
                if (e2rr){
                  console.log(e2rr);
                  res.render("register",{errorMsg:e2rr,hiddenOUT: 'hidden',hiddenIN:'',errHidden:''});
                }
                else{
                connection.query(insertStatement,[username,email,hash],function(er1r,results,fields){ ///////FIX THIS ADD SALTING
                    if (er1r){
                      console.log(er1r);
                      res.render("register",{errorMsg:er1r, hiddenOUT: 'hidden',hiddenIN:'',errHidden:''});
                    }
                    else{
                      res.render("login",{errorMsg:'',hiddenOUT: 'hidden',hiddenIN:'',confMsg: username,errHidden:'hidden',confHidden:''})
                      }
                });
                }
            });
          }
        }
    })
    }});
app.route("/login")
  .get(function(req,res){
    if (req.cookies.userData){
      console.log("User is already logged in! Redirecting...")
      res.redirect("/");
    }
    else{res.render("login",{errorMsg:'',hiddenOUT: 'hidden',hiddenIN:'',confMsg: '',errHidden:'hidden',confHidden:'hidden'})}
  })
  .post(function(req,res){
    var email = req.body.username;
    var password = req.body.password;
    var sQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(sQuery,[email],function(eror, results, fields){
      if (eror){
        console.log(eror);
        res.render("login",{errorMsg:eror,hiddenOUT: 'hidden',hiddenIN:'',confMsg: '',errHidden:'',confHidden:'hidden'})
      }
      else{
        if (results.length == 0){
            res.render("login",{errorMsg:'That email and password combination do not exist.',hiddenOUT: 'hidden',hiddenIN:'',confMsg: '',errHidden:'',confHidden:'hidden'})
        }
        else{
          var resPass = results[0].pswrd;
          bcrypt.compare(password, resPass, function(err3, rresult) {
              if (err3){
                console.log(err3);
                res.render("login",{errorMsg:err3,hiddenOUT: 'hidden',hiddenIN:'',confMsg: '',errHidden:'',confHidden:'hidden'})

              }
              else if (rresult){
                console.log(results[0].username + " logged in.");
                let cookieObj = {
                  name: results[0].username,
                  email: results[0].email,
                  temporary: false
                }
                res.cookie("userData",cookieObj,{expires:new Date(5000 + Date.now())}); //FIX THIS INTO LONGER TIME BASED COOKIE
                res.redirect("/");
              }
              else{
                console.log("Logging in failed.")
                res.render("login",{errorMsg:'That email and password combination do not exist."',hiddenOUT: 'hidden',hiddenIN:'',confMsg: '',errHidden:'',confHidden:'hidden'})

              }
          });
        }
      }
    })
  })
app.route("/forgot")
  .get(function(req,res){
    if (req.cookies.userData){
      if (req.cookies.userData.temporary){
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'hidden',errorMsg: ''})

      }
      else{
      console.log("User is already logged in! Redirecting...")
      res.redirect("/");
      }
    }
    else{
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'hidden',errorMsg: ''})
    }
  })
  .post(function(req,res){
    var email = req.body.email;
    var sQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(sQuery,[email],function(eror, results, fields){
      if (eror){
        console.log(eror);
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: eror})
      }
      else if (results.length > 0){
        var rando = randomatic('aA0',15);
        var transporter = nodemailer.createTransport({
          service: process.env.EMAILSYS,
          auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASSWORD
          }
        });
        var mailOptions = {
          from: process.env.EMAILUSER,
          to: email,
          subject: 'Password Recovery Link',
          html: 'Click this link to generate a new password: <a href = ' + process.env.SITEURL + "/forgot/"
           + rando + '>' + process.env.SITEURL + "/forgot/" + rando + '</a>'
        };
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: error})
        } else {
          console.log('Email sent: ' + info.response);
          var dStatement = "DELETE FROM forgottenPasswords WHERE email = ?;";
          var iStatement = "INSERT INTO forgottenPasswords (email,recoveryLink,inserted) VALUES (?,?,CURRENT_TIMESTAMP() )";
          var connection2 = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            multipleStatements: true})
          connection2.connect();
          connection2.query(dStatement + iStatement,[email,email,rando],function(rre,sser,fieds){
            if (rre){
              console.log(rre);
              res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: rre})
              connection2.end();
            }
            else{
              console.log("Insertion Done.")
              res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'',confMsg:'email',errHidden:'hidden',errorMsg: ''})
              connection2.end();
            }
          });
        }
      });
      }
      else{
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: "There are no accounts with that email."})
      }
    });
  })
app.get("/forgot/:linkID",function(req,res){
  if (req.cookies.userData){
    console.log("User is already logged in! Redirecting...")
    res.serve("/forgotERR",{errorMsg: "You're already logged in! You don't need to change a password."});
  }
  else{
    var linkID = req.params.linkID;
    var sQuery = "SELECT * FROM forgottenPasswords WHERE recoveryLink = ?";
    connection.query(sQuery,[linkID],function(errr,resu,fields){
      if (errr){
        console.log(errr);
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: errr})
      }
      else if (resu.length == 0){
        res.render("forgot",{hiddenOUT: 'hidden',hiddenIN:'',confHidden:'hidden',confMsg:'',errHidden:'',errorMsg: 'That is not a valid recovery link.'})
      }
      else{
        var newPass = randomatic("Aa0",12);
        var sendMail = resu[0].email;
        fQuery = "DELETE FROM forgottenPasswords WHERE email = ?;"
        var connection2 = mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          multipleStatements: true});
        connection2.connect();
        connection2.query(fQuery,[sendMail],function(er12,rree,fulds){
            if (er12){
              connection2.end();
              console.log(er12);
              res.render(forgotERR,{errorMsg: er12});
            }
            else{
              connection2.end();
              let cookieObj = {
                name: '',
                email: resu[0].email,
                temporary: true
              }
              res.cookie("userData",cookieObj,{expires:new Date(5000 + Date.now())});
              res.render('changePassword',{hiddenError: 'hidden', hiddenConfirm: 'hidden', errorMsg: '', eml:sendMail});
            }
          });}})}})
app.get("/logout",function(req,res){
  if (req.cookies.userData){
    var username = req.cookies.userData.name;
    res.clearCookie('userData');
    console.log(username + " has been logged out.");
    res.render("logout",{toRemovUser: username})
  }
  else{
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
// Search Information
app.get("/search",function(req,res){//search and search results
  console.log(req.query);
  var hiddenOUT = "";
  var hiddenIN = "";
  if (req.cookies.userData){
    if (req.cookies.userDate.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      hiddenOUT = "hidden";
    }
    else{
      hiddenIN = "hidden";
    }
  }
  else{
    hiddenOUT = "hidden";
  }
  if (req.query.length == 0){ //basic search page
      res.render("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})
  }
  else{
    if (req.query.title){
      //convert title to its corresponding id
      console.log(req.query.title);
      var ttle = req.query.title;
      imdb.search({name: ttle},{apiKey:process.env.OMDBAPI}).then(function(x){
        var serched = x.results;
        console.log(serched.length);
        if (serched.length == 0){ //forward error message
                console.log("Found Nothing...")
          res.render("search",{errHidden: "",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN});
        }
        else if (serched.length == 1){ //forward to movie page for that id
          console.log("Found 1...")
          var only1 = serched[0];
          console.log(only1);
          res.redirect("movie/" + only1.imdbid);
        }
        else{ //more than a single result
      console.log("Found Multiple...")
        }
      })
    }
    else{
      console.log("Found Nothing...")
      res.render("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN});
    }
  }
})
// Movie Page - IMDB Information, Reviews
app.get("/movie",function(req,res){ //redirect?
  res.redirect("/search");
})
app.route("/movie/:movieid")
.get(function(req,res){
  var hiddenOUT = "";
  var hiddenIN = "";
  if (req.cookies.userData){
    if (req.cookies.userDate.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      hiddenOUT = "hidden";
    }
    else{
      hiddenIN = "hidden";
    }
  }
  else{
    hiddenOUT = "hidden";
  }
  //allow users to rate movies
  //metacritic link is ez: https://www.metacritic.com/movie/the-toxic-avenger
  //rotten tomatoes link is ez: https://www.rottentomatoes.com/m/toxic_avenger
  var mId = req.params.movieid;
  var url = "https://www.omdbapi.com/?apikey=" + process.env.OMDBAPI + "&i=" + mId;
  https.get(url, function(reso){
      var body = '';
      reso.on('data', function(chunk){
          body += chunk;
      });
      reso.on('end', function(){
          var jsonRes = JSON.parse(body);
          //console.log("Got a response: ", jsonRes);
          var mTit = jsonRes.Title;
          var mRated = jsonRes.Rated;
          var mPlot = jsonRes.Plot;
          var poster = jsonRes.Poster;
          var mYear = jsonRes.Year;
          var mDir = jsonRes.Director;
          var mGenre = jsonRes.Genre;
          var mMeta, mRotten, mIMDB;
          var metaHide, imdbHide, rottenHide;
          metaHide = imdbHide = rottenHide = "hidden";
          var metaLink = "https://www.metacritic.com/movie/" + mTit.replace(/\s/g, '-').toLowerCase();
          var rotLink = "https://www.rottentomatoes.com/m/" + mTit.replace(/\s/g, '_').toLowerCase();
          var imdbLink = "https://www.imdb.com/title/" + mId;
          for (var x = 0; x < jsonRes.Ratings.length; x++){
            var src = jsonRes.Ratings[x].Source;
            if (src === "Internet Movie Database"){
              mIMDB = jsonRes.Ratings[x].Value;
              imdbHide = "";
            }
            else if (src === "Rotten Tomatoes"){
              mRotten = jsonRes.Ratings[x].Value;
              rottenHide = "";
            }
            else if (src === "Metacritic"){
              mMeta = jsonRes.Ratings[x].Value;
              metaHide = "";
            }
          }
          res.render("movie",{hiddenOUT: hiddenOUT,hiddenIN: hiddenIN, movieYear:mYear,
            movieTitle:mTit,moviePlot:mPlot,movieRating:mRated,moviePoster:poster,
          metaHidden:metaHide, metaLink: metaLink, metaRating: mMeta,
        imdbHidden: imdbHide, imdbLink: imdbLink, imdbRating: mIMDB,
      rotHidden:rottenHide, rotLink: rotLink, rotRating: mRotten})
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
                //FIX THIS: REDIRECT TO ERROR PAGE?
        res.redirect("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})
      })






})
.put(function(req,res){//assign rating
})
.post(function(req,res){//add to liked list
})
// Profile Information - Liked Movies, Movie Reviews
app.get("/profile",function(req,res){ //go to user's specfic profile, or redirect if not logged in
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      console.log("User isn't even logged in! Redirecting...");
      res.redirect("/");
    }
    else{
      var username = req.cookies.userData.name;
      res.redirect("/profile/" + username);
    }
  }
  else{
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
app.get("/profile/:username",function(req,res){
  // FIX THIS: PREVENT BOGUS PROFILE NAMES
  // FIX THIS: Add hiddenOwner
  //FIX THIS: to add this feature profile usernames must be unique
  //FIX THIS: Probably only have a list of movies user is interested in
  var profUser = req.params.username;
  if (req.cookies.userData){
    var username = req.cookies.userData.name;
    if (username === profUser){
      res.render('profile',{hiddenIN: 'hidden', hiddenOUT: '', profuser: profUser});
    }
    else{
      res.render('profile',{hiddenIN: 'hidden', hiddenOUT: '', profuser: profUser})
    }
  }
  else{
    res.render('profile',{hiddenIN: '', hiddenOUT: 'hidden', profuser: profUser})
  }
})
app.route("/changePassword")
  .get(function(req,res){
    if (req.cookies.userData){
      console.log(req.cookies.userData.name + " is currently logged in.");
      // fetch Email
      res.render("changePassword",{hiddenError: 'hidden', hiddenConfirm: 'hidden', errorMsg: '', eml:req.cookies.userData.email});
    }
    else{
      console.log("User is not logged in. Redirecting...");
      res.redirect("/");
    }
  })
  .post(function(req,res){ //send confirmation mail
    if (req.cookies.userData){
      var email = req.body.email;
      var pass = req.body.password;
      var cPass = req.body.cpassword;
      var sQuery = "UPDATE users SET pswrd = ? WHERE email = ?";
      if (pass !== cPass){
        res.render("changePassword",{hiddenError: '', hiddenConfirm: 'hidden', errorMsg: 'Your passwords did not match.', eml:email})
      }
      else{bcrypt.hash(pass, 10, function(e2rr, hash){
          if (e2rr){
            res.render("changePassword",{hiddenError: '', hiddenConfirm: 'hidden', errorMsg: e2rr, eml:email});
          }
          else{
            connection.query(sQuery,[hash,email],function(err,results){
          if (err){
            res.render("changePassword",{hiddenError: '', hiddenConfirm: 'hidden', errorMsg: '', eml:email})
          }
          else {
            var transporter = nodemailer.createTransport({
              service: process.env.EMAILSYS,
              auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPASSWORD
              }
            });
            var mailOptions = {
              from: process.env.EMAILUSER,
              to: email,
              subject: 'Your password was recently changed.',
              html: "Your password was recently changed."
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error){
                res.render("changePassword",{hiddenError: '', hiddenConfirm: 'hidden', errorMsg: error, eml:email});
              }
              else{
                res.redirect("/");
              }});
        }
        })
      }
    })};
    }
    else{
      res.redirect("/");
    }})
app.get("/test",function(req,res){
  var url = "https://www.omdbapi.com/?apikey=" + process.env.OMDBAPI + "&t=The+Avengers";
  // console.log(url);
  https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
          body += chunk;
      });

      res.on('end', function(){
          var fbResponse = JSON.parse(body);
          console.log("Got a response: ", fbResponse);
      });
  }).on('error', function(e){
        console.log("Got an error: ", e);
  });

})
app.listen(3000,function(){
  console.log("Server Started.")
});
