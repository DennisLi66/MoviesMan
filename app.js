require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');
const mysql = require('mysql'); //FIX THIS: Maybe only open connections in functions, then close them immediately
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const randomatic = require('randomatic');
const imdb = require('imdb-api');
//FIX THIS - ADD MOST LIKED MOVIES, MOST HIGHLY RATED AMONG USERS

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
})
connection.connect(); //FIX THIS MOVE CONNECTIONS TO INSIDE SQL CALLS

//Home
app.get("/", function(req, res) { //FIX THIS TO MAKE MORE LIKE A HOMEPAGE
  var hiddenOUT = "hidden";
  var hiddenIN = "";
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
    } else {
      res.cookie("userData", req.cookies.userData, {
        expires: new Date(900000 + Date.now())
      })
      console.log(req.cookies.userData.name + " has been reauthenticated");
      //REAUTHEN
      hiddenIN = "hidden";
      hiddenOUT = "";
    }
  }
  res.render("home", {
    banner: "MoviesMan: Homepage",
    hiddenOUT: hiddenOUT,
    hiddenIN: hiddenIN
  })
}); //REWORK
app.get("/recent", function(req, res) {
  var hiddenOUT = "hidden";
  var hiddenIN = "";
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
    } else {
      res.cookie("userData", req.cookies.userData, {
        expires: new Date(900000 + Date.now())
      })
      console.log(req.cookies.userData.name + " has been reauthenticated");
      hiddenIN = "hidden";
      hiddenOUT = "";
    }
  }
  var sQuery =
    `
    (select "Like" as Chosen , likes.imdbID, title, poster, count(*) as totalLikes, NULL as username, NULL as rating, NULL as textbox, NULL as Average, max(recency) as recency
    from likes group by imdbID LIMIT 6)
    union all
    (select "Rate" as Chosen, ratings.imdbID, title, poster, NULL as totalLikes, username, rating, textbox, Average ,recency
    from ratings
    left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRating
    ON ratings.imdbID = aRating.imdbID LIMIT 6) order by recency
    `;
  connection.query(sQuery, function(error, results, fields) {
    if (error) {
      console.log(error);
      res.redirect("/");
    } else {
      console.log(results);
      var likes = [];
      var rates = [];
      for (let u = 0; u < results.length; u++) {
        if (results[u].Chosen === "Like") {
          likes.push(results[u]);
        } else {
          rates.push(results[u]);
        }
      }
      res.render("recent", {
        banner: "MoviesMan: Recently Interacted Movies",
        hiddenOUT: hiddenOUT,
        hiddenIN: hiddenIN,
        movies: likes,
        rates: rates
      })
    }
  })
})
app.get("/about", function(req, res) { //FIX THIS TO ACTUALLY DESCRIBE THE SITE
  var hiddenOUT = "hidden";
  var hiddenIN = "";
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
    } else {
      res.cookie("userData", req.cookies.userData, {
        expires: new Date(900000 + Date.now())
      })
      console.log(req.cookies.userData.name + " has been reauthenticated");
      hiddenOUT = "";
      hiddenIN = "hidden";
    }
  }
  res.render("about", {
    banner: "MoviesMan: About Page",
    hiddenOUT: hiddenOUT,
    hiddenIN: hiddenIN
  });

});
// Registration and Login
app.route("/register")
  .get(function(req, res) {
    if (req.cookies.userData) {
      if (req.cookies.userData.temporary) {
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
        res.render("register", {
          banner: "MoviesMan: Registration",
          errorMsg: '',
          hiddenOUT: 'hidden',
          hiddenIN: '',
          errHidden: 'hidden'
        });
      } else {
        console.log("User is already logged in! Redirecting...")
        res.redirect("/");
      }
    } else {
      res.render("register", {
        banner: "MoviesMan: Registration",
        errorMsg: '',
        hiddenOUT: 'hidden',
        hiddenIN: '',
        errHidden: 'hidden'
      });
    }
  })
  .post(function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var cPassword = req.body.cPassword;
    var username = req.body.username;
    if (cPassword !== password) { //confirmation did not match
      res.render("register", {
        banner: "MoviesMan: Registration",
        errorMsg: "The passwords did not match.",
        hiddenOUT: 'hidden',
        hiddenIN: '',
        errHidden: ''
      });
    } else {
      var query1 = "SELECT username FROM users WHERE email = " + connection.escape(email);
      connection.query(query1, function(err, results, fields) {
        if (err) {
          console.log(err);
          res.render("register", {
            banner: "MoviesMan: Registration",
            errorMsg: err,
            hiddenOUT: 'hidden',
            hiddenIN: '',
            errHidden: ''
          });
        } else {
          if (results.length > 0) {
            res.render("register", {
              banner: "MoviesMan: Registration",
              errorMsg: "An account using that email already exists.",
              hiddenOUT: 'hidden',
              hiddenIN: '',
              errHidden: ''
            });
          } else {
            var insertStatement = "INSERT INTO users (username,email,pswrd) VALUES (?, ?, ?)";
            bcrypt.hash(password, 10, function(e2rr, hash) {
              // Store hash in your password DB.
              if (e2rr) {
                console.log(e2rr);
                res.render("register", {
                  banner: "MoviesMan: Registration",
                  errorMsg: e2rr,
                  hiddenOUT: 'hidden',
                  hiddenIN: '',
                  errHidden: ''
                });
              } else {
                connection.query(insertStatement, [username, email, hash], function(er1r, results, fields) {
                  if (er1r) {
                    console.log(er1r);
                    res.render("register", {
                      banner: "MoviesMan: Registration",
                      errorMsg: er1r,
                      hiddenOUT: 'hidden',
                      hiddenIN: '',
                      errHidden: ''
                    });
                  } else {
                    res.render("login", {
                      banner: "MoviesMan: Login",
                      errorMsg: '',
                      hiddenOUT: 'hidden',
                      hiddenIN: '',
                      confMsg: username,
                      errHidden: 'hidden',
                      confHidden: ''
                    })
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
  .get(function(req, res) {
    if (req.cookies.userData) {
      console.log("User is already logged in! Redirecting...")
      res.redirect("/");
    } else {
      res.render("login", {
        banner: "MoviesMan: Login",
        errorMsg: '',
        hiddenOUT: 'hidden',
        hiddenIN: '',
        confMsg: '',
        errHidden: 'hidden',
        confHidden: 'hidden'
      })
    }
  })
  .post(function(req, res) {
    var email = req.body.username;
    var password = req.body.password;
    var sQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(sQuery, [email], function(eror, results, fields) {
      if (eror) {
        console.log(eror);
        res.render("login", {
          banner: "MoviesMan: Login",
          errorMsg: eror,
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confMsg: '',
          errHidden: '',
          confHidden: 'hidden'
        })
      } else {
        if (results.length == 0) {
          res.render("login", {
            banner: "MoviesMan: Login",
            errorMsg: 'That email and password combination do not exist.',
            hiddenOUT: 'hidden',
            hiddenIN: '',
            confMsg: '',
            errHidden: '',
            confHidden: 'hidden'
          })
        } else {
          var resPass = results[0].pswrd;
          bcrypt.compare(password, resPass, function(err3, rresult) {
            if (err3) {
              console.log(err3);
              res.render("login", {
                banner: "MoviesMan: Login",
                errorMsg: err3,
                hiddenOUT: 'hidden',
                hiddenIN: '',
                confMsg: '',
                errHidden: '',
                confHidden: 'hidden'
              })

            } else if (rresult) {
              console.log(results[0].username + " logged in.");
              let cookieObj = {
                name: results[0].username,
                email: results[0].email,
                id: results[0].userID,
                temporary: false
              }
              res.cookie("userData", cookieObj, {
                expires: new Date(900000 + Date.now())
              });
              res.redirect("/");
            } else {
              console.log("Logging in failed.")
              res.render("login", {
                banner: "MoviesMan: Login",
                errorMsg: 'That email and password combination do not exist."',
                hiddenOUT: 'hidden',
                hiddenIN: '',
                confMsg: '',
                errHidden: '',
                confHidden: 'hidden'
              })

            }
          });
        }
      }
    })
  })
app.route("/forgot")
  .get(function(req, res) {
    if (req.cookies.userData) {
      if (req.cookies.userData.temporary) {
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
        res.render("forgot", {
          banner: "MoviesMan: Forgot Your Password?",
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confHidden: 'hidden',
          confMsg: '',
          errHidden: 'hidden',
          errorMsg: ''
        })

      } else {
        console.log("User is already logged in! Redirecting...")
        res.redirect("/");
      }
    } else {
      res.render("forgot", {
        banner: "MoviesMan: Forgot Your Password?",
        hiddenOUT: 'hidden',
        hiddenIN: '',
        confHidden: 'hidden',
        confMsg: '',
        errHidden: 'hidden',
        errorMsg: ''
      })
    }
  })
  .post(function(req, res) {
    var email = req.body.email;
    var sQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(sQuery, [email], function(eror, results, fields) {
      if (eror) {
        console.log(eror);
        res.render("forgot", {
          banner: "MoviesMan: Forgot Your Password?",
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confHidden: 'hidden',
          confMsg: '',
          errHidden: '',
          errorMsg: eror
        })
      } else if (results.length > 0) {
        var rando = randomatic('aA0', 15);
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
          html: 'Click this link to generate a new password: <a href = ' + process.env.SITEURL + "/forgot/" +
            rando + '>' + process.env.SITEURL + "/forgot/" + rando + '</a>'
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.render("forgot", {
              banner: "MoviesMan: Forgot Your Password?",
              hiddenOUT: 'hidden',
              hiddenIN: '',
              confHidden: 'hidden',
              confMsg: '',
              errHidden: '',
              errorMsg: error
            })
          } else {
            console.log('Email sent: ' + info.response);
            var dStatement = "DELETE FROM forgottenPasswords WHERE email = ?;";
            var iStatement = "INSERT INTO forgottenPasswords (email,recoveryLink,inserted) VALUES (?,?,CURRENT_TIMESTAMP() )";
            var connection2 = mysql.createConnection({
              host: process.env.HOST,
              user: process.env.USER,
              password: process.env.PASSWORD,
              database: process.env.DATABASE,
              multipleStatements: true
            })
            connection2.connect();
            connection2.query(dStatement + iStatement, [email, email, rando], function(rre, sser, fieds) {
              if (rre) {
                console.log(rre);
                res.render("forgot", {
                  banner: "MoviesMan: Forgot Your Password?",
                  hiddenOUT: 'hidden',
                  hiddenIN: '',
                  confHidden: 'hidden',
                  confMsg: '',
                  errHidden: '',
                  errorMsg: rre
                })
                connection2.end();
              } else {
                console.log("Insertion Done.")
                res.render("forgot", {
                  banner: "MoviesMan: Forgot Your Password?",
                  hiddenOUT: 'hidden',
                  hiddenIN: '',
                  confHidden: '',
                  confMsg: 'email',
                  errHidden: 'hidden',
                  errorMsg: ''
                })
                connection2.end();
              }
            });
          }
        });
      } else {
        res.render("forgot", {
          banner: "MoviesMan: Forgot Your Password?",
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confHidden: 'hidden',
          confMsg: '',
          errHidden: '',
          errorMsg: "There are no accounts with that email."
        })
      }
    });
  })
app.get("/forgot/:linkID", function(req, res) {
  if (req.cookies.userData) {
    console.log("User is already logged in! Redirecting...")
    res.serve("/forgotERR", {
      errorMsg: "You're already logged in! You don't need to change a password."
    });
  } else {
    var linkID = req.params.linkID;
    var sQuery = "SELECT * FROM forgottenPasswords WHERE recoveryLink = ?";
    connection.query(sQuery, [linkID], function(errr, resu, fields) {
      if (errr) {
        console.log(errr);
        res.render("forgot", {
          banner: "MoviesMan: Forgot Your Password?",
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confHidden: 'hidden',
          confMsg: '',
          errHidden: '',
          errorMsg: errr
        })
      } else if (resu.length == 0) {
        res.render("forgot", {
          banner: "MoviesMan: Forgot Your Password?",
          hiddenOUT: 'hidden',
          hiddenIN: '',
          confHidden: 'hidden',
          confMsg: '',
          errHidden: '',
          errorMsg: 'That is not a valid recovery link.'
        })
      } else {
        var newPass = randomatic("Aa0", 12);
        var sendMail = resu[0].email;
        fQuery = "DELETE FROM forgottenPasswords WHERE email = ?;"
        var connection2 = mysql.createConnection({
          host: process.env.HOST,
          user: process.env.USER,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          multipleStatements: true
        });
        connection2.connect();
        connection2.query(fQuery, [sendMail], function(er12, rree, fulds) {
          if (er12) {
            connection2.end();
            console.log(er12);
            res.redirect("/forgot")
          } else {
            connection2.end();
            let cookieObj = {
              name: '',
              email: resu[0].email,
              temporary: true
            }
            res.cookie("userData", cookieObj, {
              expires: new Date(5000 + Date.now())
            });
            res.render('changePassword', {
              banner: "MoviesMan: Change Your Password",
              hiddenError: 'hidden',
              hiddenConfirm: 'hidden',
              errorMsg: '',
              eml: sendMail
            });
          }
        });
      }
    })
  }
})
app.get("/logout", function(req, res) {
  if (req.cookies.userData) {
    var username = req.cookies.userData.name;
    res.clearCookie('userData');
    console.log(username + " has been logged out.");
    res.render("logout", {
      banner: "MoviesMan: Logged Out",
      toRemovUser: username,
      hiddenOUT: "hidden",
      hiddenIN: ""
    })
  } else {
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
// Search Information
app.get("/search", function(req, res) { //search and search results
  var hiddenOUT = "";
  var hiddenIN = "";
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      hiddenOUT = "hidden";
    } else {
      res.cookie("userData", req.cookies.userData, {
        expires: new Date(900000 + Date.now())
      })
      console.log(req.cookies.userData.name + " has been reauthenticated");
      hiddenIN = "hidden";
    }
  } else {
    hiddenOUT = "hidden";
  }
  if (req.query.length == 0) { //basic search page
    res.render("search", {
      banner: "MoviesMan: Search Page",
      errHidden: "hidden",
      hiddenOUT: hiddenOUT,
      hiddenIN: hiddenIN
    })
  } else {
    if (req.query.title) {
      // console.log(req.query.title);
      var ttle = req.query.title;
      var worked = true;
      imdb.search({
          name: ttle
        }, {
          apiKey: process.env.OMDBAPI
        })
        .catch((error) => worked = false)
        .then(function(x) {
          if (worked) {
            var serched = x.results;
            if (serched.length == 1) { //forward to movie page for that id
              console.log("Found a Single Value...")
              var only1 = serched[0];
              res.redirect("movie/" + only1.imdbid);
            } else { //more than a single result
              console.log("Found Multiple...")
              console.log(serched);
              res.render("searchResults", {
                banner: "MoviesMan: Search Results",
                sResults: serched,
                errHidden: "hidden",
                hiddenOUT: hiddenOUT,
                hiddenIN: hiddenIN
              })
            }
          } else {
            console.log("Found Nothing...")
            res.render("search", {
              banner: "MoviesMan: Search Page",
              errHidden: "",
              hiddenOUT: hiddenOUT,
              hiddenIN: hiddenIN
            });
          }
        })
    } else {
      console.log("Found Nothing...")
      res.render("search", {
        banner: "MoviesMan: Search Page",
        errHidden: "hidden",
        hiddenOUT: hiddenOUT,
        hiddenIN: hiddenIN
      });
    }
  }
})
// Movie Page - IMDB Information, Reviews
app.get("/movie", function(req, res) { //redirect?
  res.redirect("/search");
})
app.route("/movie/:movieid") //REWORK
  .get(function(req, res) {
    // Objective: Display Movie Details, Number of Likes, Number of Rates
    var hiddenOUT = "hidden";
    var hiddenIN = "";
    var liked = "";
    var rated = "";
    var mId = req.params.movieid;
    var url = "https://www.omdbapi.com/?apikey=" + process.env.OMDBAPI + "&i=" + mId;
    var sQuery = "";
    var variables = [];
    if (req.cookies.userData) {
      if (req.cookies.userData.temporary) {
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
      } else {
        res.cookie("userData", req.cookies.userData, {
          expires: new Date(900000 + Date.now())
        })
        console.log(req.cookies.userData.name + " has been reauthenticated");
        hiddenIN = "hidden";
        hiddenOUT = "";
        variables = [];
      }
    }
    sQuery =
      `
    SELECT * FROM
    (select rL.imdbID as imdbID, movieName as title, ifnull(Likes,0) as Likes, Average, users.userId, users.username, if(liked.imdbID is null,"False","True") as Liked ,rating, textbox from
    ratingsList left join  (select imdbID, avg(rating) as Average from ratingsList GROUP BY imdbID) rL
    ON rL.imdbID = ratingsList.imdbID
    left join users ON users.email = ratingsList.email
    left join (select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
    ON likes.imdbID = ratingsList.imdbID left join
    (select imdbID, email from likelist GROUP BY imdbID) liked
    on liked.email = ratingsList.email AND liked.imdbID = ratingsList.imdbID
    UNION ALL
     SELECT likeList.imdbID, likeList.movieName as title, Likes, ifnull(Average,0) as Average, users.userId, users.username, "True" as Liked, ifnull(rating,0) as rating, textbox FROM
    likeList left join
    (select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
    on likeList.imdbID = likes.imdbID left join
    (select avg(rating) as Average,imdbID from ratingsList group by imdbID) rL
    on rL.imdbID = likeList.imdbID left join
    (select * from ratingsList) rates ON rates.imdbID = likeList.imdbID AND rates.email = likeList.email
    left join users on users.email = likeList.email WHERE rating is NULL OR rating = 0
    ) movies
    WHERE imdbID = ?
    `;
    variables.push(req.params.movieid);
    https.get(url, function(reso) {
      var body = '';
      reso.on('data', function(chunk) {
        body += chunk;
      });
      reso.on('end', function() {
        var jsonRes = JSON.parse(body);
        console.log("Got a response: ", jsonRes);
        if (jsonRes.Response === "False") {
          res.render("search", {
            banner: "MoviesMan: Search Page",
            errHidden: "",
            hiddenOUT: hiddenOUT,
            hiddenIN: hiddenIN
          });
        } else {
          var metaLink = "";
          var metaRating = "";
          var imdbLink = "";
          var imdbRating = "";
          var rtLink = "";
          var rtRating = "";
          var rate = '0';
          var reviews = []
          var liked = "Like";
          var likes = '0';
          var textbox = "";
          for (let o = 0; o < jsonRes.Ratings.length; o++) {
            var item = jsonRes.Ratings[o];
            if (item.Source === "Internet Movie Database") {
              imdbLink = "https://www.imdb.com/title/" + mId;
              imdbRating = item.Value;
            } else if (item.Source === "Rotten Tomatoes") {
              rtLink = "https://www.rottentomatoes.com/m/" + jsonRes.Title.replace(/\s/g, '_').toLowerCase();
              rtRating = item.Value;
            } else if (item.Source === "Metacritic") {
              metaLink = "https://www.metacritic.com/movie/" + jsonRes.Title.replace(/\s/g, '-').toLowerCase();
              metaRating = item.Value;
            }
          }
          connection.query(sQuery, variables, function(er, re, fiel) {
            if (er) {
              console.log(er);
              res.render("search", {
                banner: "MoviesMan: Search Page",
                errHidden: "",
                hiddenOUT: hiddenOUT,
                hiddenIN: hiddenIN
              });
            } else {
              console.log(re);
              if (re.length == 0) {
                console.log("There are no pre-existing likes or ratings.")
              } else {
                for (let g = 0; g < re.length; g++) {
                  //change ratings
                  if (rate === '0' && re[g].Average != 0) {
                    rate = re[g].Average;
                  }
                  if (likes === '0' && re[g].Likes != 0) {
                    likes = re[g].Likes;
                  }
                  //check reviews and users
                  if (req.cookies.userData && re[g].userId === req.cookies.userData.id) {
                    if (re[g].Liked === "True") {
                      liked = "Unlike";
                    }
                    if (re[g].rating == 0) {
                      rated = "Unrated";
                    } else {
                      rated = re[g].rating;
                    }
                    if (re[g].textbox) {
                      textbox = re[g].textbox;
                    }
                  }
                  if (re[g].textbox) {
                    reviews.push(re[g]);
                  }
                }
                // console.log(reviews);
              }
              res.render("movie", {
                banner: "MoviesMan: " + jsonRes.Title,
                mId: req.params.movieid,
                hiddenOUT: hiddenOUT,
                hiddenIN: hiddenIN,
                title: jsonRes.Title,
                poster: jsonRes.Poster,
                year: jsonRes.Year,
                genre: jsonRes.Genre,
                runtime: jsonRes.Runtime,
                release: jsonRes.Released,
                plot: jsonRes.Plot,
                director: jsonRes.Director,
                esrb: jsonRes.Rated,
                metaLink: metaLink,
                metaRating: metaRating,
                imdbLink: imdbLink,
                imdbRating: imdbRating,
                rtLink: rtLink,
                rtRating: rtRating,
                rate: rate,
                likes: likes,
                reviews: reviews,
                liked: liked,
                rated: rated,
                textbox: textbox
              });
            }
          })
        }
      })
    })
  })
  .post(function(req, res) { //add to liked list or assign rating
    var hiddenOUT = "";
    var hiddenIN = "";
    console.log("POST REQUEST TRIGGERED!")
    if (req.cookies.userData) {
      if (req.cookies.userData.temporary) {
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
        hiddenOUT = "hidden";
        res.redirect("login");
      } else {
        hiddenIN = "hidden";
      }
      if (req.body.selfRating && req.body.liked) {
        console.log("Shouldn't perform these at the same time!");
        //have a hidden input to transfer all the ejs elements back into here
        res.redirect("/movie/" + req.params.movieid);
      } else if (req.body.liked) {
        console.log("Adding to Liked List...");
        var iquery =
          `
        INSERT INTO likeList (email,imdbID,movieName) VALUES (?,?,?);
        INSERT INTO recentLikes(imdbID,poster,mName,userID,recency) VALUES (?,?,?,?,NOW());
        `;
        var dquery =
          `
        DELETE FROM likeList WHERE email = ? AND imdbID = ?;
        DELETE FROM recentLikes WHERE userID = ? AND imdbID = ?;
        `;
        if (req.body.liked === 'Like') {
          connection.query(iquery,
            [req.cookies.userData.email, req.params.movieid, req.body.mname,
              req.params.movieid, req.body.poster, req.body.mname, req.cookies.userData.id
            ],
            function(er, results, fields) {
              if (er) {
                console.log(er);
              }
              res.redirect("/movie/" + req.params.movieid);
            })
        } else {
          connection.query(dquery, [req.cookies.userData.email, req.params.movieid,
            req.cookies.userData.id, req.params.movieid
          ], function(er, results, fields) {
            if (er) {
              console.log(er);
            }
            res.redirect("/movie/" + req.params.movieid);
          })
        }
      } else if (req.body.selfRating) {
        console.log("Adding to Rating List...")
        var iQuery =
          `
        INSERT INTO ratingsList (email,imdbID,movieName,rating,textbox) VALUES (?,?,?,?,?)
          ON DUPLICATE KEY UPDATE rating = VALUES(rating), textbox = VALUES(textbox);
        INSERT INTO recentReviews (imdbID,mname,poster,userID,username,rating,textbox,recency) VALUES (?,?,?,?,?,?,?,NOW())
          ON DUPLICATE KEY UPDATE rating = VALUES(rating), textbox = VALUES(textbox), recency = VALUES(recency);
        `;
        connection.query(iQuery, [
          req.cookies.userData.email, req.params.movieid, req.body.mname, req.body.choice, req.body.tReview,
          req.params.movieid, req.body.mname, req.body.poster, req.cookies.userData.id, req.cookies.userData.name, req.body.choice, req.body.textbox
        ], function(errors, result, fi) {
          if (errors) {
            console.log(errors);
          }
          res.redirect("/movie/" + req.params.movieid);
        })
      } else {
        console.log("Nothing Happened?")
        res.redirect("/movie/" + req.params.movieid);
      }
    } else {
      res.redirect("/login");
    }
  })
// Profile Information - Liked Movies, Movie Reviews
app.get("/profile", function(req, res) { //go to user's specfic profile, or redirect if not logged in
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      console.log("User isn't even logged in! Redirecting...");
      res.redirect("/");
    } else {
      var username = req.cookies.userData.id;
      res.redirect("/profile/" + username);
    }
  } else {
    console.log("User isn't even logged in! Redirecting...");
    res.redirect("/");
  }
})
app.route("/profile/:userID") //REWORK
  .get(function(req, res) {
    var profID = req.params.userID;
    var userEmail = req.params.email;
    var profUser = "";
    var hiddenOUT = "hidden";
    var hiddenIN = "";
    var username = "";
    var notOwnerHidden = "hidden";
    var likes = [];
    var rates = [];
    if (req.cookies.userData) {
      if (req.cookies.userData.temporary) {
        res.clearCookie('userData');
        console.log(username + " has been logged out.");
      } else {
        res.cookie("userData", req.cookies.userData, {
          expires: new Date(900000 + Date.now())
        })
        console.log(req.cookies.userData.name + " has been reauthenticated");
        hiddenIN = "hidden";
        hiddenOUT = "";
        if (profID == req.cookies.userData.id) {
          notOwnerHidden = "";
        }
      }
    }
    var sQuery =
      `
      SELECT * FROM
(select userID,username, email from users where userID = ?) info
LEFT JOIN
(select "Liked" as Chosen, users.email as email, poster, likeList.imdbID, movieName as title, NULL as rating, NULL as textbox, recency
from likelist left join users on users.email = likeList.email left join recentLikes on likeList.imdbID = recentLikes.imdbID AND recentLikes.userID = users.userID
UNION
select "Rated" as Chosen, users.email as email, poster, ratingsList.imdbID, movieName as title, ratingsList.rating, ratingsList.textbox, recency
from ratingsList left join users on users.email = ratingsList.email left join recentReviews on recentReviews.imdbID = ratingsList.imdbID AND recentReviews.userID = users.userID
) lists
ON lists.email = info.email ORDER BY recency
    `;
    connection.query(sQuery, [profID], function(erro, results, fields) {
      if (erro) {
        console.log(erro);
        res.render('profile', {
          banner: "MoviesMan: " + profUser,
          hiddenIN: hiddenIN,
          hiddenOUT: hiddenOUT,
          profuser: profUser,
          likedRated: likedRated,
          noLikes: noLikes,
          noRates: noRates,
          notOwnerHidden: notOwnerHidden,
          profID: profID
        });
      } else {
        if (results.length == 0) { // No Such user Exists
          console.log("No such user exists with that id.");
          res.redirect("/");
        } else {
          profUser = results[0].username;
          for (var x = 0; x < results.length; x++) {
            if (results[x].Chosen === "Liked") {
              likes.push(results[x]);
            } else if (results[x].Chosen === "Rated") {
              rates.push(results[x]);
            }
          }
          res.render('profile', {
            banner: "MoviesMan: " + profUser,
            hiddenIN: hiddenIN,
            hiddenOUT: hiddenOUT,
            profuser: profUser,
            likes: likes,
            rates: rates,
            notOwnerHidden: notOwnerHidden,
            profID: profID
          })
        }
      }
    })
  })
app.get("/profile/:userID/delete/:mID", function(req, res) {
  var mID = req.params.mID;
  var userID = req.params.userID;
  console.log(mID);
  console.log(userID);
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      res.redirect("/login");
    } else {
      if (userID == req.cookies.userData.id) { //correct entrance
        var dQuery =
          `
         DELETE FROM likes WHERE userID = ? AND imdbID = ?;
         `;
        connection.query(dQuery, [req.cookies.userData.id, mID], function(error, results, fields) {
          if (error) {
            console.log(error);
          }
          res.redirect("/profile/" + userID);
        })
      } else {
        res.redirect("/profile/" + userID);
      }
    }
  } else { //user not logged in
    res.redirect("/login")
  }
})
app.get("/profile/:userID/deleter/:mID", function(req, res) {
  var mID = req.params.mID;
  var userID = req.params.userID;
  console.log(mID);
  console.log(userID);
  if (req.cookies.userData) {
    if (req.cookies.userData.temporary) {
      res.clearCookie('userData');
      console.log(username + " has been logged out.");
      res.redirect("/login");
    } else {
      if (userID == req.cookies.userData.id) {
        var dQuery =
          `
        DELETE from ratings WHERE userID = ? AND imdbID = ?,
        `;
        connection.query(dQuery, [ req.cookies.userData.id, mID], function(error, results, fields) {
          if (error) {
            console.log(error);
          }
          res.redirect("/profile/" + userID);
        })
      } else {
        res.redirect("/profile/" + userID);
      }
    }
  } else {
    res.redirect("/login")
  }
}) 
// Changing Password
app.route("/changePassword")
  .get(function(req, res) {
    if (req.cookies.userData) {
      console.log(req.cookies.userData.name + " is currently logged in.");
      // fetch Email
      res.render("changePassword", {
        banner: "MoviesMan: Change Password",
        hiddenError: 'hidden',
        hiddenConfirm: 'hidden',
        errorMsg: '',
        eml: req.cookies.userData.email
      });
    } else {
      console.log("User is not logged in. Redirecting...");
      res.redirect("/");
    }
  })
  .post(function(req, res) { //send confirmation mail
    if (req.cookies.userData) {
      var email = req.body.email;
      var pass = req.body.password;
      var cPass = req.body.cpassword;
      var sQuery = "UPDATE users SET pswrd = ? WHERE email = ?";
      if (pass !== cPass) {
        res.render("changePassword", {
          banner: "MoviesMan: Change Password",
          hiddenError: '',
          hiddenConfirm: 'hidden',
          errorMsg: 'Your passwords did not match.',
          eml: email
        })
      } else {
        bcrypt.hash(pass, 10, function(e2rr, hash) {
          if (e2rr) {
            res.render("changePassword", {
              banner: "MoviesMan: Change Password",
              hiddenError: '',
              hiddenConfirm: 'hidden',
              errorMsg: e2rr,
              eml: email
            });
          } else {
            connection.query(sQuery, [hash, email], function(err, results) {
              if (err) {
                res.render("changePassword", {
                  banner: "MoviesMan: Change Password",
                  hiddenError: '',
                  hiddenConfirm: 'hidden',
                  errorMsg: '',
                  eml: email
                })
              } else {
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
                transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                    res.render("changePassword", {
                      banner: "MoviesMan: Change Password",
                      hiddenError: '',
                      hiddenConfirm: 'hidden',
                      errorMsg: error,
                      eml: email
                    });
                  } else {
                    res.redirect("/");
                  }
                });
              }
            })
          }
        })
      };
    } else {
      res.redirect("/");
    }
  })
app.listen(3000, function() {
  console.log("Server Started.")
});
