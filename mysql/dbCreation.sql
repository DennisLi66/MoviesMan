drop database if exists movieManDB; 
create database movieManDB;
use movieManDB;

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

create table ratings(
	userID int NOT NULL,
	username varchar(255) NOT NULL,
	imdbID varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	poster varchar(255) NOT NULL,
	rating int NOT NULL,
	recency datetime,
	textbox TEXT,
	CONSTRAINT LL PRIMARY KEY (userID,imdbID)
);

create table likes(
	userID int NOT NULL,
	imdbID varchar(255) NOT NULL,
	title varchar(255) NOT NULL,
	poster varchar(255) NOT NULL,
	recency datetime,
	CONSTRAINT LL PRIMARY KEY (userID,imdbID)
);
-- rework likeList and reviewList