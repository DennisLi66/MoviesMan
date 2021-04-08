-- Important Tables 
-- ratingsList, recentReviews, recentLikes  


SELECT NOW() as cTime;






select email, imdbID as ID, movieName as movie, rating, textbox as review from ratingsList;
select * from recentReviews; -- remove ratings and reviews
select * from recentLikes; -- if unlike, remove from recent likes as well
select * from likeList;


SELECT "Like" as Chosen, rLikes.imdbID as imdbID, movieName as title, poster, totalLikes, NULL as userID, NULL as username, NULL as rating, NULL as textbox, NULL as Average FROM
(select * from recentLikes ORDER BY recency DESC LIMIT 5) rLikes
left join
(SELECT email,imdbID,movieName, count(*) as totalLikes FROM likelist GROUP BY imdbID) tLikes
ON rLikes.imdbID = tLikes.imdbID
UNION
SELECT "Rate" as Chosen, recentReviews.imdbID as imdbID, mName as title, poster, NULL as totalLikes, userID, username, rating, textbox, Average FROM
-- select recentReviews.imdbID as imdbID, mName as title, poster, userID, username, rating, textbox, Average FROM
(SELECT * FROM recentReviews ORDER BY recency DESC LIMIT 5) recentReviews
LEFT JOIN
(select imdbID,avg(rating) as Average from ratingsList group by imdbID) ratings ON
recentReviews.imdbID = ratings.imdbID;

     --  SELECT * FROM ( SELECT ifnull(email,emul) as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM
--       (
--       SELECT * FROM (select * from ratingsList WHERE ratingsList.imdbID = "tt1333125"
--       )  y LEFT JOIN (select email as emul, imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt1333125" AND email = "1@2.com"
--       ) z ON z.Liked = y.imdbID AND email = emul UNION 
--       SELECT * FROM (
--       select * from ratingsList WHERE ratingsList.imdbID = "tt1333125"
--       )  y RIGHT JOIN (select email as emul,imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt1333125" AND email = "1@2.com"
--       ) z ON z.Liked = y.imdbID AND email = emul WHERE email is null 
--       ) a 
--       ) userRating 
--       
--       
--       
--       SELECT * FROM likelist
--       
--       
--       
--       
--       RIGHT JOIN ( SELECT * from ( SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber ,ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
--       (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
--       LEFT JOIN  (select imdbID,count(*) as RatingNumber,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
--       UNION ALL SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
--       (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN
--       (select imdbID,count(*) as RatingNumber, avg(rating) as Average from ratingsList GROUP BY imdbID) c
--       ON a.imdbID = c.imdbID WHERE a.imdbID IS NULL) b WHERE imdbID = "tt1333125"
--       ) allRatings ON allRatings.imdbID = userRating.ID