-- moviePage Query tt1333125
-- select * from likeList;
-- select * from ratingsList;

-- Movies and their Amount of Likes
select imdbID, movieName, count(*) as LikeAmount from likelist GROUP BY imdbID;
-- Movies and thier Average Rating with Reviews
select rL.imdbID as imdbID, movieName as title, Average, users.userId, users.username, rating, textbox from 
ratingsList 
left join 
(select imdbID, avg(rating) as Average from ratingsList GROUP BY imdbID) rL 
ON rL.imdbID = ratingsList.imdbID
left join users
ON users.email = ratingsList.email;


   ( SELECT "Like" as Chosen, rLikes.imdbID as imdbID, movieName as title, poster, totalLikes, NULL as userID, NULL as username, NULL as rating, NULL as textbox, NULL as Average FROM
    (select * from recentLikes ORDER BY recency DESC ) rLikes
    left join
    (SELECT email,imdbID,movieName, count(*) as totalLikes FROM likelist GROUP BY imdbID) tLikes
    ON rLikes.imdbID = tLikes.imdbID  LIMIT 6)
    UNION
    (SELECT "Rate" as Chosen, recentReviews.imdbID as imdbID, mName as title, poster, NULL as totalLikes, userID, username, rating, textbox, Average FROM
    -- select recentReviews.imdbID as imdbID, mName as title, poster, userID, username, rating, textbox, Average FROM
    (SELECT * FROM recentReviews ORDER BY recency DESC) recentReviews
    LEFT JOIN
    (select imdbID,avg(rating) as Average from ratingsList group by imdbID) ratings ON
    recentReviews.imdbID = ratings.imdbID  LIMIT 6);

-- Movie Reviews associated with their amount of likes 
select rL.imdbID as imdbID, movieName as title, ifnull(Likes,0) as Likes, Average, users.userId, users.username, if(liked.imdbID is null,"False","True") as Liked ,rating, textbox from 
ratingsList 
left join 
(select imdbID, avg(rating) as Average from ratingsList GROUP BY imdbID) rL 
ON rL.imdbID = ratingsList.imdbID
left join 
users
ON users.email = ratingsList.email
left join
(select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
ON likes.imdbID = ratingsList.imdbID
left join 
(select imdbID, email from likelist GROUP BY imdbID) liked
on liked.email = ratingsList.email AND liked.imdbID = ratingsList.imdbID;
 -- Movie Likes associated with their ratings
 SELECT likeList.imdbID, likeList.movieName as title, Likes, ifnull(Average,0) as Average, users.userId, users.username, "True" as Liked, ifnull(rating,0) as rating, textbox FROM
likeList
left join
(select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
on likeList.imdbID = likes.imdbID
left join
(select avg(rating) as Average,imdbID from ratingsList group by imdbID) rL
on rL.imdbID = likeList.imdbID
left join 
(select * from ratingsList) rates
ON rates.imdbID = likeList.imdbID AND rates.email = likeList.email
left join
users
on users.email = likeList.email;






-- ALL MOVIES -- test later
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
-- WHERE imdbID = ?
-- WHERE imdbID = 'tt0120382'
;
 