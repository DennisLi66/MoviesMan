drop database if exists movieManDB; 
create database movieManDB;
use movieManDB;
-- users need userID, userName, email, password, 
create table users(
	userID int NOT NULL auto_increment primary key,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    pswrd varchar(255) NOT NULL
);



create table forgottenPasswords(
	email varchar(255),
	recoveryLink varchar(255),
    inserted DATE
);


-- //drop table forgottenPasswords; 
-- likelist
-- create table likeList(
-- userID int NOT NULL
--  ,movieID  --figure out what data type a movieID is
-- );
-- ratings
-- create table ratingsList(
-- userID int NOT NULL,
-- movieID,
-- rating float NOT NULL
-- )

-- select * from users
-- select * from forgottenPasswords