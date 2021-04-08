-- Profile Query 
SELECT * FROM
(select userID,username, email from users where userID = 7) info
LEFT JOIN
(select "Liked" as Chosen, email, imdbID, movieName as title, NULL as rating, NULL as textbox 
from likeList
UNION
select "Rated" as Chosen, email, imdbID, movieName as title, rating, textbox
from ratingsList) lists
ON lists.email = info.email
;
--  Profile Query with posters
SELECT * FROM
(select userID,username, email from users where userID = 6) info
LEFT JOIN
(select "Liked" as Chosen, email, poster, likeList.imdbID, movieName as title, NULL as rating, NULL as textbox 
from likelist left join recentLikes on likeList.imdbID = recentLikes.imdbID
UNION
select "Rated" as Chosen, email, poster, ratingsList.imdbID, movieName as title, ratingsList.rating, ratingsList.textbox
from ratingsList left join recentReviews on recentReviews.imdbID = ratingsList.imdbID) lists
ON lists.email = info.email
;

-- moviePage Query tt1333125
select * from likeList;
select * from ratingsList;
