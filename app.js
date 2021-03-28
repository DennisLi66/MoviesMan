require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require('cookie-parser'); //FIX THIS: UPDATE COOKIES ON VISITING SITES
const mysql = require('mysql'); //FIX THIS: Maybe only open connections in functions, then close them immediately
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
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
                  id: results[0].userID,
                  temporary: false
                }
                res.cookie("userData",cookieObj,{expires:new Date(500000 + Date.now())}); //FIX THIS INTO LONGER TIME BASED COOKIE
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
    res.render("logout",{toRemovUser: username,hiddenOUT:"hidden",hiddenIN:""})
  }
  else{
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
// Search Information
app.get("/search",function(req,res){//search and search results
  var hiddenOUT = "";
  var hiddenIN = "";
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
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
      console.log(req.query.title);
      var ttle = req.query.title;
      var worked = true;
      imdb.search({name: ttle},{apiKey:process.env.OMDBAPI})
        .catch( (error) => worked = false)
        .then(function(x){
        if (worked){
          var serched = x.results;
          if (serched.length == 1){ //forward to movie page for that id
            console.log("Found a Single Value...")
            var only1 = serched[0];
            res.redirect("movie/" + only1.imdbid);
          }
          else{ //more than a single result
            console.log("Found Multiple...")
            console.log(serched);
            res.render("searchResults",{sResults:serched,errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})
          }
        }
        else{
          console.log("Found Nothing...")
          res.render("search",{errHidden: "",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN});
        }})}
    else{
      console.log("Found Nothing...")
      res.render("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN});
    }
  }})
// Movie Page - IMDB Information, Reviews
app.get("/movie",function(req,res){ //redirect?
  res.redirect("/search");
})
app.route("/movie/:movieid")
.get(function(req,res){ //FIX THIS: ADD number of likes and user rating
  var hiddenOUT = "";
  var hiddenIN = "";
  var likeOption = "like";
  var likeText = "Like"
  var mId = req.params.movieid;
  var numberOfRaters = 0;
  var averageRating = "Unrated";
  var numberOfLikes = 0;
  var previouslyRated = 0;
  var hiddenRating = "hidden";
  var url = "https://www.omdbapi.com/?apikey=" + process.env.OMDBAPI + "&i=" + mId;
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      hiddenOUT = "hidden";
    }
    else{
      hiddenIN = "hidden";
//START OF MYSQL ADD MORE VARIABLES

      var cQuery =
      `
      SELECT * FROM ( SELECT ifnull(email,emul) as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM
      (SELECT * FROM (select * from ratingsList WHERE ratingsList.imdbID = ?
      )  y LEFT JOIN (select email as emul, imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = ?
      ) z ON z.Liked = y.imdbID UNION SELECT * FROM (select * from ratingsList WHERE ratingsList.imdbID = ?
      )  y LEFT JOIN (select email as emul,imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = ?
      ) z ON z.Liked = y.imdbID WHERE email is null) a WHERE email = ?
      ) userRating RIGHT JOIN ( SELECT * from ( SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber ,ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
      (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
      LEFT JOIN  (select imdbID,count(*) as RatingNumber,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
      UNION ALL SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
      (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN
      (select imdbID,count(*) as RatingNumber, avg(rating) as Average from ratingsList GROUP BY imdbID) c
      ON a.imdbID = c.imdbID WHERE a.imdbID IS NULL) b WHERE imdbID = ?
      ) allRatings ON allRatings.imdbID = userRating.ID
      `
      ;
      connection.query(cQuery,[mId,mId,mId,mId,req.cookies.userData.email,mId],function(error,results,fields){
        if (error){
          console.log(error);
          res.redirect("/movie/" + req.params.movieid);
        }
        else{
          console.log(results);
          if (results.length == 0){ //no ratings or likes yet
            console.log("Not Yet Liked or Rated, Using Defaults...");
            hiddenOUT = "hidden";
            var offQuery = `
            SELECT * from (
            SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber ,ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
            (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
            LEFT JOIN
            (select imdbID,count(*) as RatingNumber,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
            UNION ALL
            SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
            (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN
            (select imdbID,count(*) as RatingNumber, avg(rating) as Average from ratingsList GROUP BY imdbID) c
            ON a.imdbID = c.imdbID
            WHERE a.imdbID IS NULL
          ) b WHERE imdbID = ?;
            `
            connection.query(offQuery,[mId],function(error,results,fields){
              if (error){
                console.log(error);
                res.redirect("/movie/" + mId);
              }
              else if (results){
                if (results.length == 0){
                  console.log("Not Yet Liked or Rated, Using Defaults...")
                }
                else{
                  console.log(results[0]);
                  averageRating = results[0].Average;
                  numberOfRaters = results[0].RatingNumber;
                  numberOfLikes = results[0].Likes;
                }}})
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
                    res.render("movie",{hiddenOUT: hiddenOUT,hiddenIN: hiddenIN, movieYear:mYear, mId:mId,
                      movieTitle:mTit,moviePlot:mPlot,movieRating:mRated,moviePoster:poster,
                    metaHidden:metaHide, metaLink: metaLink, metaRating: mMeta,
                  imdbHidden: imdbHide, imdbLink: imdbLink, imdbRating: mIMDB,
                rotHidden:rottenHide, rotLink: rotLink, rotRating: mRotten,
              likeOpt: likeOption, likeText: likeText,
              rateCount:numberOfRaters, likeCount:numberOfLikes, avgRATING: averageRating, hiddenRating: hiddenRating, previouslyRated:previouslyRated
            })});}).on('error', function(e){
                  console.log("Got an error: ", e);
                          //FIX THIS: REDIRECT TO ERROR PAGE?
                  res.redirect("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})
                })
          }
          else if (results.length >= 1){
            console.log(results[0]);
            averageRating = results[0].Average;
            numberOfRaters = results[0].RatingNumber;
            numberOfLikes = results[0].Likes;
            if (results[0].Rating){
              previouslyRated = results[0].Rating;
              hiddenRating = "";
            }
            if (results[0].Liked){
              if (results[0].Liked === "Liked"){
                likeOption = "unlike";
                likeText = "Unlike";
              }
            }
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
                    res.render("movie",{hiddenOUT: hiddenOUT,hiddenIN: hiddenIN, movieYear:mYear, mId:mId,
                      movieTitle:mTit,moviePlot:mPlot,movieRating:mRated,moviePoster:poster,
                    metaHidden:metaHide, metaLink: metaLink, metaRating: mMeta,
                  imdbHidden: imdbHide, imdbLink: imdbLink, imdbRating: mIMDB,
                rotHidden:rottenHide, rotLink: rotLink, rotRating: mRotten,
              likeOpt: likeOption, likeText: likeText,
              rateCount:numberOfRaters, likeCount:numberOfLikes, avgRATING: averageRating, hiddenRating: hiddenRating, previouslyRated:previouslyRated
  })});}).on('error', function(e){
                  console.log("Got an error: ", e);
                  //FIX THIS: REDIRECT TO ERROR PAGE?
                  res.redirect("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})})}}})}}
  else{
    hiddenOUT = "hidden";
    var offQuery = `
    SELECT * from (
    SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber ,ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
    (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
    LEFT JOIN
    (select imdbID,count(*) as RatingNumber,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
    UNION ALL
    SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
    (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN
    (select imdbID,count(*) as RatingNumber, avg(rating) as Average from ratingsList GROUP BY imdbID) c
    ON a.imdbID = c.imdbID
    WHERE a.imdbID IS NULL
  ) b WHERE imdbID = ?;
    `
    connection.query(offQuery,[mId],function(error,results,fields){
      if (error){
        console.log(error);
        res.redirect("/movie/" + mId);
      }
      else if (results){
        if (results.length == 0){
          console.log("Not Yet Liked or Rated, Using Defaults...")
        }
        else{
          console.log(results[0]);
          averageRating = results[0].Average;
          numberOfRaters = results[0].RatingNumber;
          numberOfLikes = results[0].Likes;
        }}})
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
            res.render("movie",{hiddenOUT: hiddenOUT,hiddenIN: hiddenIN, movieYear:mYear, mId:mId,
              movieTitle:mTit,moviePlot:mPlot,movieRating:mRated,moviePoster:poster,
            metaHidden:metaHide, metaLink: metaLink, metaRating: mMeta,
          imdbHidden: imdbHide, imdbLink: imdbLink, imdbRating: mIMDB,
        rotHidden:rottenHide, rotLink: rotLink, rotRating: mRotten,
      likeOpt: likeOption, likeText: likeText,
      rateCount:numberOfRaters, likeCount:numberOfLikes, avgRATING: averageRating, hiddenRating: hiddenRating, previouslyRated:previouslyRated
    })});}).on('error', function(e){
          console.log("Got an error: ", e);
                  //FIX THIS: REDIRECT TO ERROR PAGE?
          res.redirect("search",{errHidden: "hidden",hiddenOUT:hiddenOUT,hiddenIN:hiddenIN})
        })}})
.post(function(req,res){//add to liked list or assign rating
  var hiddenOUT = "";
  var hiddenIN = "";
  console.log("POST REQUEST TRIGGERED!")
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      hiddenOUT = "hidden";
      res.redirect("login");
    }
    else{
      hiddenIN = "hidden";
    }
    console.log(req.params.movieid);
    if (req.body.selfRating && req.body.liked){
      console.log("Shouldn't perform these at the same time!");
      //have a hidden input to transfer all the ejs elements back into here
      res.redirect("/movie/" + req.params.movieid);
    }
    else if (req.body.liked){
      console.log("Adding to Liked List...");
      if (req.body.liked === "like"){
        console.log(req.body.mname)
        var query = "INSERT INTO likeList (email,imdbID,movieName) VALUES (?,?,?)";
        connection.query(query,[req.cookies.userData.email,req.params.movieid,req.body.mname],function(eror, results, fields){
          if (eror){
            console.log(eror);
          }
            res.redirect("/movie/" + req.params.movieid); // FIX THIS: WILL NEED TO USE SQL TO SEE IF ALREADY LIKED
        })
      }
      else{
        var query = "DELETE FROM likeList WHERE email = ? AND imdbID = ?";
        connection.query(query,[req.cookies.userData.email,req.params.movieid],function(eror,results,fields){
          if (eror){
            console.log(eror);
          }
          res.redirect("/movie/" + req.params.movieid);
        })
      }
    }
    else if (req.body.selfRating){
      console.log("Adding to Rating List...")
      var query =
      `
      INSERT INTO ratingsList
        (email, imdbID, movieName, rating)
      VALUES
        (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        rating     = VALUES(rating)
      `
      var selfRating = f = parseInt(req.body.selfRating);
      if (selfRating < 1 || selfRating > 10){
        console.log("Invalid Number is being used!");
        res.redirect("/movie/" + req.params.movieid);
      }
      else{
        connection.query(query,
          [req.cookies.userData.email,req.params.movieid,req.body.mname,selfRating],function(error,results,fields){
            if (error){
              console.log(error);
            }
            res.redirect("/movie/" + req.params.movieid);
        })
      }
    }
    else{
      console.log("Nothing Happened?")
      res.redirect("/movie/" + req.params.movieid);
    }
  }
  else{
    res.redirect("/login");
  }
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
      var username = req.cookies.userData.id;
      res.redirect("/profile/" + username);
    }
  }
  else{
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
app.route("/profile/:userID")
.get(function(req,res){
  var profID = req.params.userID;
  var userEmail = req.params.email;
  var profUser = "";
  var hiddenOUT = "hidden";
  var hiddenIN = "";
  var username = "";
  var notOwnerHidden = "hidden";
  var likedRated = [];
  var noLikes = "";
  var noRates = "";
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
    }
    else{
      hiddenIN = "hidden";
      hiddenOUT = "";
      if (profID == req.cookies.userData.id){
        notOwnerHidden = "";
      }
    }
  }
    var sQuery =
    `
    select userID, username, users.email as email, imdbID,title,Rating,Liked
    from users
    LEFT JOIN
    (
    select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName) as title, if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
    from likeList
    left join
    (select * from ratingsList) rL
    on likeList.email = rL.email AND likeList.imdbID = rL.imdbID
    UNION ALL
    (select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName) as title, if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
    from likeList
    right join
    (select * from ratingsList) rL
    on likeList.email = rL.email AND likeList.imdbID = rL.imdbID WHERE likeList.email is null)
    ) details
    ON details.email = users.email
    WHERE userID = ?
    `;
    connection.query(sQuery,[profID],function(erro,results,fields){
      if (erro){
        console.log(erro);
        res.render('profile',{hiddenIN: hiddenIN, hiddenOUT: hiddenOUT, profuser: profUser,
          likedRated: likedRated,  noLikes:noLikes, noRates:noRates, notOwnerHidden:notOwnerHidden,
          profID: profID
        }); //FIX THIS
      }
      else{
        if (results.length == 0){ // No Such user Exists
          console.log("No such user exists with that id.");
          res.redirect("/");
        }
        else{
          profUser = results[0].username;
          likedRated = results;
          // check results for a rating and like, then break if both
          for (var x = 0; x < results.length; x++){
            if (results[x].Rating){
              noRates = "hidden";
            }
            if (results[x].Liked){
              noLikes = "hidden";
            }
            if (noLikes === "hidden" && noRates === "hidden"){
              break;
            }
          }
          res.render('profile',{hiddenIN: hiddenIN, hiddenOUT: hiddenOUT, profuser: profUser,
            lR: likedRated,  noLikes:noLikes, noRates:noRates,notOwnerHidden:notOwnerHidden,
            profID: profID
          })
        }
      }
    })
})

app.get("/profile/:userID/delete/:mID",function(req,res){
  var mID = req.params.mID;
  var userID = req.params.userID;
  console.log(mID);
  console.log(userID);
  if (req.cookies.userData){
    if (req.cookies.userData.temporary){
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      res.redirect("/login");
    }
    else{
      if (userID == req.cookies.userData.id){ //correct entrance
        var dQuery =  "DELETE FROM likeList WHERE email = ? AND imdbID = ?";
        connection.query(dQuery,[req.cookies.userData.email,mID],function(error,results,fields){
          if (error){
            console.log(error);
          }
            res.redirect("/profile/" + userID);
        })
      }
      else{
        res.redirect("/login");
      }
    }
  }
  else{ //user not logged in
    res.redirect("/login")
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
