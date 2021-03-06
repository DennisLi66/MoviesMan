drop database if exists movieManDB; 
create database movieManDB;
use movieManDB;
-- users need userID, userName, email, password, 
create table users(
	userID int NOT NULL auto_increment primary key,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    pswrd varchar(255) NOT NULL
);

create table forgottenPasswords(
	email varchar(255) NOT NULL ,
	recoveryLink varchar(255) NOT NULL,
    inserted DATE NOT NULL
    
);

-- likelist
create table likeList(
	email varchar(255) NOT NULL,
imdbID varchar(255) NOT NULL,
movieName varchar(255) NOT NULL,
CONSTRAINT LL PRIMARY KEY (email,imdbID)
);
-- ratings

create table ratingsList(
	email varchar(255) NOT NULL,
imdbID varchar(255) NOT NULL,
movieName varchar(255) NOT NULL,
rating int NOT NULL,
textbox TEXT,
CONSTRAINT RL PRIMARY KEY (email,imdbID)
);

-- ALTER TABLE ratingsList
-- ADD textbox varchar(255);


-- recent likes
create table recentLikes(
imdbID varchar(255) NOT NULL,
mName varchar(255) NOT NULL,
poster varchar(255) NOT NULL,
userID int NOT NULL,
recency datetime
);
-- recent reviews
create table recentReviews(
imdbID varchar(255) NOT NULL,
mName varchar(255) NOT NULL,
poster varchar(255) NOT NULL,
userID INT NOT NULL,
username varchar(255) NOT NULL,
rating int NOT NULL,
recency datetime
,textbox TEXT,
CONSTRAINT RL PRIMARY KEY (userID,imdbID)
);

-- drop table likeList;
-- drop table ratingsList;
-- drop table recentReviews;
-- drop table recentLikes;
-- select * from likeList;
-- select * from ratingsList
-- select * from users
-- select * from forgottenPasswords