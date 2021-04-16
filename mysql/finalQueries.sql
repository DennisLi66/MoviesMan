-- Needs imdbID, title, amount of likes, Average Rating, Number of Raters, reviewer's id and username, reviewers rating and textbox

-- BASIC QUERIES
select * from likes;
select * from ratings;
-- MOST QUERIES
-- Most Liked Movies
select imdbID, title, poster, count(*) as `Total Likes`, max(recency) as Recent from likes group by imdbID ORDER BY `Total Likes` DESC,  Recent DESC
;
-- Most Highly Rated Movies
select imdbID,title,poster,avg(rating) as `Average Rating`, max(recency) as Recent from ratings group by imdbID
;
-- RECENCY QUERIES
-- Most Recently Liked movies
select likes.imdbID,title,poster,max(recency) as `Most Recent`,`Total Likes` from likes 
left join (select imdbID, count(imdbID) as `Total Likes` from likes group by imdbID) tLikes
ON tLikes.imdbID = likes.imdbID
group by imdbID
order by likes.recency DESC
;
-- Most Recently Rated Movies
select * from ratings;

-- RECENTS PAGE QUERY
-- SELECT "Like" as Chosen, rLikes.imdbID as imdbID, movieName as title, poster, totalLikes, NULL as userID, NULL as username, NULL as rating, NULL as textbox, NULL as Average, max(recency) as recency
(select "Like" as Chosen , likes.imdbID, title, poster, count(*) as totalLikes, NULL as username, NULL as rating, NULL as textbox, NULL as Average, max(recency) as recency
from likes group by imdbID LIMIT 6)
union all
(select "Rate" as Chosen, ratings.imdbID, title, poster, NULL as totalLikes, username, rating, textbox, Average ,recency 
from ratings
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRating
ON ratings.imdbID = aRating.imdbID LIMIT 6) order by recency
;

-- Profile Queries
select users.userID as userID, username, Chosen, poster, imdbID, title, rating, textbox, recency from users
left join
(
select userID, 'Liked' as Chosen, poster, imdbID, title, NULL as rating, NULL as textbox, recency from likes
UNION ALL
select userID, 'Rated' as Chosen, poster, imdbID, title, rating, textbox, recency from ratings
) movies
on movies.userID = users.userID
ORDER BY recency DESC
;
-- movie queries
--     SELECT * FROM
--     (select rL.imdbID as imdbID, movieName as title, ifnull(Likes,0) as Likes, Average, users.userId, users.username, if(liked.imdbID is null,"False","True") as Liked ,rating, textbox from
--     ratingsList left join  (select imdbID, avg(rating) as Average from ratingsList GROUP BY imdbID) rL
--     ON rL.imdbID = ratingsList.imdbID
--     left join users ON users.email = ratingsList.email
--     left join (select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
--     ON likes.imdbID = ratingsList.imdbID left join
--     (select imdbID, email from likelist GROUP BY imdbID) liked
--     on liked.email = ratingsList.email AND liked.imdbID = ratingsList.imdbID
--     UNION ALL
--      SELECT likeList.imdbID, likeList.movieName as title, Likes, ifnull(Average,0) as Average, users.userId, users.username, "True" as Liked, ifnull(rating,0) as rating, textbox FROM
--     likeList left join
--     (select imdbID, count(*) as Likes from likelist GROUP BY imdbID) likes
--     on likeList.imdbID = likes.imdbID left join
--     (select avg(rating) as Average,imdbID from ratingsList group by imdbID) rL
--     on rL.imdbID = likeList.imdbID left join
--     (select * from ratingsList) rates ON rates.imdbID = likeList.imdbID AND rates.email = likeList.email
--     left join users on users.email = likeList.email WHERE rating is NULL OR rating = 0
--     ) movies
--     WHERE imdbID = ?

-- imdbid, title, likes, average. usersid, username, Liked, rating, textbox
select likes.imdbID as imdbID, likes.title as  title, Likes, Average, likes.userID, users.username, 'True' as Liked, ifnull(rating,0) as rating, textbox from likes
left join users on users.userID = likes.userID
left join ratings on users.userID = ratings.userID and likes.imdbID = ratings.imdbID AND likes.userID = ratings.userID
left join (select imdbID, count(*) as Likes from likes group by imdbID) tLikes ON tLikes.imdbID = likes.imdbID
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRatings ON aRatings.imdbID = likes.imdbID
UNION ALL
select ratings.imdbID as imdbID, ratings.title as title, ifnull(Likes,0) as Likes, Average, ratings.userID, ratings.username, if(likes.imdbID is NULL,'False','True') as Liked, rating, textbox from ratings 
left join likes on likes.userID = ratings.userID AND likes.imdbID = ratings.imdbID
left join (select imdbID, count(*) as Likes from likes group by imdbID) tLikes ON tLikes.imdbID = ratings.imdbID
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRatings ON aRatings.imdbID = ratings.imdbID
WHERE likes.imdbID is null;