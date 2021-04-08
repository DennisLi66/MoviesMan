-- Profile Query 
SELECT * FROM
(select userID,username, email from users where userID = 7) info
LEFT JOIN
(select "Liked" as Chosen, email, imdbID, movieName as title, NULL as rating, NULL as textbox 
from likelist
UNION
select "Rated" as Chosen, email, imdbID, movieName as title, rating, textbox
from ratingsList) lists
ON lists.email = info.email
;

-- moviePage Query 