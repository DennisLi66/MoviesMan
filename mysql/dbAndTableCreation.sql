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
CONSTRAINT RL PRIMARY KEY (email,imdbID)
);


-- gets all the likes and ratings
SELECT * from (
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
LEFT JOIN 
(select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
UNION ALL
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN 
(
select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID
) c ON a.imdbID = c.imdbID
WHERE 
a.imdbID IS NULL
) b







-- drop table likeList;
-- drop table ratingsList;
-- select * from likeList
-- select * from ratingsList
-- select * from users
-- select * from forgottenPasswords