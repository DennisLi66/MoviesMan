-- gets all the likes and ratings
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
) b;

-- select imdbID, movieName, count(*) from likeList group by imdbID


-- Below Query Obtains all the likes and rates for a specified email
SELECT "a@s.com" as email
, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM 
(SELECT * FROM
(select * from ratingsList WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y LEFT JOIN (select imdbID as Liked, movieName as title from likeList WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID
UNION SELECT * FROM
(select * from ratingsList WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y
LEFT JOIN
(select imdbID as Liked, movieName as title from likeList WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID WHERE email is  null) a;



-- Specified Movie and User Email

SELECT * FROM 
(
SELECT ifnull(email,emul) as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM 
(SELECT * FROM
(select * from ratingsList WHERE ratingsList.imdbID = "tt0120915" -- BLANK: Change to movies's id
-- WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y LEFT JOIN (select email as emul, imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt0092965"-- WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID
UNION SELECT * FROM
(select * from ratingsList WHERE ratingsList.imdbID = "tt0120915" -- BLANK: Change to movies's id
-- WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ? 
)  y
LEFT JOIN
(select email as emul,imdbID as Liked, movieName as title from likeList WHERE likeList.imdbID = "tt0092965"-- WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID WHERE email is null) a 
WHERE email = "a@2.com" -- BLANK: Change to user's email 
) userRating

RIGHT JOIN
(
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
) b
WHERE imdbID = "tt0120915" -- BLANK: Change to movies's id
) allRatings ON allRatings.imdbID = userRating.ID
