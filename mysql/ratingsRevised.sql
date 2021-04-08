-- Important Tables 
-- ratingsList, recentReviews, recentLikes  


SELECT NOW() as cTime;






select email, imdbID as ID, movieName as movie, rating, textbox as review from ratingsList;
select * from recentReviews; -- remove ratings and reviews
select * from recentLikes; -- if unlike, remove from recent likes as well
select * from likeList;

SELECT rLikes.imdbID as imdbID, mName as title, poster, totalLikes FROM
(select * from recentLikes ORDER BY recency DESC LIMIT 5) rLikes
left join
(SELECT email,imdbID,movieName, count(*) as totalLikes FROM likelist GROUP BY imdbID) tLikes
ON rLikes.imdbID = tLikes.imdbID;

select * from recentReviews;
select * from ratingsList;

--       SELECT * FROM ( SELECT ifnull(email,emul) as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM
--       (
--       SELECT * FROM (select * from ratingsList WHERE ratingsList.imdbID = "tt1631867"
--       )  y LEFT JOIN (select email as emul, imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt1631867"
--       ) z ON z.Liked = y.imdbID UNION 
--       
--       SELECT * FROM (select * from ratingsList WHERE ratingsList.imdbID = "tt1631867"
--       )  y RIGHT JOIN (select email as emul,imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt1631867"
--       ) z ON z.Liked = y.imdbID WHERE email is null
--       ) a WHERE email = "1@2.com" OR emul = "1@2.com"
--       ) userRating 
--       RIGHT JOIN ( SELECT * from ( SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber ,ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
--       (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
--       LEFT JOIN  (select imdbID,count(*) as RatingNumber,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
--       UNION ALL SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(RatingNumber,0) as RatingNumber, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM
--       (select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN
--       (select imdbID,count(*) as RatingNumber, avg(rating) as Average from ratingsList GROUP BY imdbID) c
--       ON a.imdbID = c.imdbID WHERE a.imdbID IS NULL) b WHERE imdbID = "tt1631867"
--       ) allRatings ON allRatings.imdbID = userRating.ID