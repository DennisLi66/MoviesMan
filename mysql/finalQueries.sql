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
select likes.imdbID,title,poster,max(recency) as `Most Recent`,`Total Likes` from likes 
left join (select imdbID, count(imdbID) as `Total Likes` from likes group by imdbID) tLikes
ON tLikes.imdbID = likes.imdbID
group by imdbID
order by likes.recency DESC
;
-- SELECT "Like" as Chosen, rLikes.imdbID as imdbID, movieName as title, poster, totalLikes, NULL as userID, NULL as username, NULL as rating, NULL as textbox, NULL as Average, max(recency) as recency
(select "Like" as Chosen , likes.imdbID, title, poster, count(*) as totalLikes, NULL as username, NULL as rating, NULL as textbox, NULL as Average, max(recency) as recency
from likes group by imdbID LIMIT 6)
union all
(select "Rate" as Chosen, ratings.imdbID, title, poster, NULL as totalLikes, username, rating, textbox, Average ,recency 
from ratings
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRating
ON ratings.imdbID = aRating.imdbID LIMIT 6) order by recency
