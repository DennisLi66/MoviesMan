use movieManDB;

-- Select a user by their id 
select userID, username, email from users;

-- gets all the likes and ratings with email associations

select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName), if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
from likeList
left join
(select * from ratingsList) rL
on likeList.email = rL.email AND likeList.imdbID = rL.imdbID
UNION ALL
(select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName), if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
from likeList
right join
(select * from ratingsList) rL
on likeList.email = rL.email AND likeList.imdbID = rL.imdbID WHERE likeList.email is null);

-- get all the likes and ratings associated to a particular email
select userID, username, users.email as email, imdbID,title,Rating,Liked
from users
LEFT JOIN
(
select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName) as title, if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
from likeList
left join
(select * from ratingsList) rL
on likeList.email = rL.email AND likeList.imdbID = rL.imdbID
UNION ALL
(select ifnull(likeList.email,rl.email) as email, ifnull(likeList.imdbID,rl.imdbID) as imdbID,ifnull(rl.movieName,likelist.movieName) as title, if(rl.rating is null,0,rl.rating) as Rating, if(likeList.imdbID is null,"Unliked","Liked") as Liked
from likeList
right join
(select * from ratingsList) rL
on likeList.email = rL.email AND likeList.imdbID = rL.imdbID WHERE likeList.email is null)
) details
ON details.email = users.email
;











