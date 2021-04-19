# MoviesMan

MoviesMan is a site meant to store ratings and likes based on the users who make an account with the site. <br>

 Coding Languages Used <br>
HTML/EJS was used to display the webpages. <br>
Simple CSS was used, but Bootstrap was used for most of the display work. <br>
Javascript was used to create the backend, specifically using Node and Express. <br>
MYSQL was used to store all the user information, along with likes and opinions on movies. <br>

 Node Packages Used  <br>
Express: Used to Serve the website <br>
BodyParser: Used to supplement Express <br>
CookieParser: Allows me to implement logging in and out <br>
EJS: Allows me to make webpages more modular <br>
Nodemailer: Used to send a recovery email to users <br>
Randomatic: Used to produce a random token for retrieving passwords <br>
bcrypt: Allows me to salt and hash passwords for protection <br>
dotenv: Allows me to store information like keys and mail passwords safely <br>
mysql: Used to store user data onto storage <br>
imdb-api: Used to retrieve information about movies found on imdb. <br>

In-depth Description of Pages:

  Navbar Element: <br>
    The navbar will show the relevant links to the other accessible pages. There is also a search that allows for easy searching for movies.

  Homepage: <br>
    The homepage will briefly welcome users to the site and show the most recently liked and rated movies, along with the most highly rated and most liked. Clicking on a movie's title or poster should bring you to the movie's page, while clicking on a user's username will bring you to their profile page.

  Recent Movies Page: <br>
    The recent movies page shows the most recently liked or rated movies. Clicking on a movie's title or poster should bring you to the movie's page, while clicking on a user's username will bring you to their profile page.

  Best Movies Page: <br>
    The best movies page shows the movies with the highest ratings and most amount of likes. Clicking on a movie's title or poster should bring you to the movie's page, while clicking on a user's username will bring you to their profile page.

  About Page: <br>
    This page shows a more abridged version of this read-me, with a few less sections.

  Registration Page: <br>
    The registration page has a brief list of features that users will be able to access. Using a username, email, and password, users will be able to create an account with MoviesMan. If they already have an account, they can be redirected to the login page, or the forgot password page if they need a reminder.

  Login Page: <br>
    The login page is a simple login page for MoviesMan with a email and password field. If a user is not already a member, they can register, or go to the forgotten password page if they need to.

  Forgot Password Page: <br>
    The page prompts the user for a valid MoviesMan registered email to send a recovery email to. There are also links back to the registration and login page.

  Search Results Page: <br>
    The page will show movies that the api have fetched based on the searched title. Clicking on a title or poster will bring the user to the clicked movie.

  Movie Page: <br>
    A movie page will show details about a movie, including a release year and any ratings it has between IMDB, Metacritic, and Rotten Tomatoes. Clicking the logo for one of the aforementioned sites will allow users to go that site's rating of the movie. Users will be able to see the amount of likes, average ratings, and reviews left behind by MoviesMan registered users, and will be able to like/unlike and rate/rerate a movie if they themselves are logged in.

  Profile Page: <br>
    A profile page will list the movies a user has liked and rated. Clicking on a movie's title or poster will bring a user to the associated page for that movie.


  Description of MYSQL Tables: <br>
    users: <br>
      userID - Used to generate profiles <br>
      username - What the user chooses to publicly display as their profile name <br>
      email - Used for recovery purposes and uniqueness <br>
      pswrd - hashed version of the user's password <br>
    ratings: <br>
      userID - Used to link the review to the reviewer <br>
      username - Used for easy displaying of the reviewer's name <br>
      imdbID - Used to signal which movie has been rated <br>
      title - Used for easy displaying of the movie <br>
      poster - poster of the movie for easy display purposes <br>
      rating - the rating the user has assigned to the movie <br>
      recency - when the rate occurred, for easy sorting <br>
      textbox - the text of the review, if there was any <br>
    likes: <br>
      userID - Used to link the like to the liker <br>
      imdbID - Used to signal which movie has been liked <br>
      title -  title of the movie for easy display purposes <br>
      poster - poster of the movie for easy display purposes <br> 
      recency - when the like occurred, for easy sorting <br>
    forgottenPasswords: <br>
      email: The associated email to a forgotten password <br>
      recoveryLink: The associated link to a forgotten password <br>
      inserted: the day that the link was created <br>

Actions required to make the site work: <br>
  API-KEY: An api key must be obtained from http://www.omdbapi.com/.

  .env file description: <br>
      HOST=The MYSQL HOST <br>
      PORT=THE MYSQL PORT <br>
      DATABASE= movieManDB (The database for MYSQL) <br>
      USER= (The MYSQL user) <br>
      PASSWORD= (The MYSQL password) <br>
      EMAILSYS=(The server location for the nodemailer (gmail,yahoo,hotmail)) <br>
      EMAILUSER=(the email address for the nodemailer) <br>
      EMAILPASSWORD= (the email password for nodemailer) <br>
      SITEURL= (where the site is located) <br>
      HTTPSURL=(https:// + where the site is located) <br>
      OMDBAPI= the apikey from the above action <br>
  MYSQL files:
    The file dbCreation must be used to create the tables the site interacts with. The sampleInsertionScript can be then loaded to provide example data. It is not needed, but the site will be empty without its activation.
