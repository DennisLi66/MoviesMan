-- gets all the likes and ratings
SELECT * from (
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
LEFT JOIN 
(select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
UNION ALL
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN 
(select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID) c 
ON a.imdbID = c.imdbID
WHERE a.imdbID IS NULL
) b;

-- select imdbID, movieName, count(*) from likeList group by imdbID


-- Below Query Obtains all the likes and rates for a specified email
SELECT "1@2.com" as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM 
(SELECT * FROM
(select * from ratingsList WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y LEFT JOIN (select imdbID as Liked, movieName as title from likeList WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID
UNION SELECT * FROM
(select * from ratingsList WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y
RIGHT JOIN
(select imdbID as Liked, movieName as title from likeList WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID WHERE email is  null) a;

;-- UNION OF THE TWO ABOVE WITH NO SPECIFICATIONS
SELECT * FROM 
(
SELECT ifnull(email,emul) as email, ifnull(imdbID,Liked) as ID, ifnull(movieName,title) as Title, ifnull(rating,0) as Rating, if(Liked is NULL,"Unliked","Liked") as Liked FROM 
(SELECT * FROM
(select * from ratingsList -- WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y LEFT JOIN (select email as emul, imdbID as Liked, movieName as title from likeList -- WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID
UNION SELECT * FROM
(select * from ratingsList -- WHERE ratingsList.email = "1@2.com" -- AND ratingsList.imdbID = ?
)  y
RIGHT JOIN
(select email as emul,imdbID as Liked, movieName as title from likeList -- WHERE likeList.email = "1@2.com" -- AND likeList.imdbID = ?
) z ON z.Liked = y.imdbID WHERE email is  null) a) userRating
LEFT JOIN
(
SELECT * from (
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a
LEFT JOIN 
(select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID) c ON a.imdbID = c.imdbID
UNION ALL
SELECT ifnull(a.imdbID,c.imdbID) as imdbID, ifnull(Likes,0) as Likes, ifnull(Average,0) as Average FROM 
(select imdbID,count(*) as Likes from likeList GROUP BY imdbID) a RIGHT JOIN 
(select imdbID,avg(rating) as Average from ratingsList GROUP BY imdbID) c 
ON a.imdbID = c.imdbID
WHERE a.imdbID IS NULL
) b

) allRatings ON allRatings.imdbID = userRating.ID

;