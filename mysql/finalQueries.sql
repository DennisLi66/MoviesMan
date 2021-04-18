-- Needs imdbID, title, amount of likes, Average Rating, Number of Raters, reviewer's id and username, reviewers rating and textbox

-- BASIC QUERIES
select * from users;
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
-- imdbid, title, likes, average. usersid, username, Liked, rating, textbox
select likes.imdbID as imdbID, likes.title as  title, Likes, Average, likes.userID as userID, users.username, 'True' as Liked, ifnull(rating,0) as rating, textbox from likes
left join users on users.userID = likes.userID
left join ratings on users.userID = ratings.userID and likes.imdbID = ratings.imdbID AND likes.userID = ratings.userID
left join (select imdbID, count(*) as Likes from likes group by imdbID) tLikes ON tLikes.imdbID = likes.imdbID
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRatings ON aRatings.imdbID = likes.imdbID
UNION ALL
select ratings.imdbID as imdbID, ratings.title as title, ifnull(Likes,0) as Likes, Average, ratings.userID as userID, ratings.username, if(likes.imdbID is NULL,'False','True') as Liked, rating, textbox from ratings 
left join likes on likes.userID = ratings.userID AND likes.imdbID = ratings.imdbID
left join (select imdbID, count(*) as Likes from likes group by imdbID) tLikes ON tLikes.imdbID = ratings.imdbID
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRatings ON aRatings.imdbID = ratings.imdbID
WHERE likes.imdbID is null;

-- BEST MOVIES
(select 'Most Liked' as Chosen,likes.imdbID as imdbID, title, poster, Likes, NULL as Average, NULL as Raters, recency from likes
left join (select count(imdbID) as Likes, imdbID from likes group by imdbID) tLikes 
on tLikes.imdbID = likes.imdbID GROUP BY likes.imdbID ORDER BY Likes DESC, recency DESC LIMIT 6)
UNION ALL
(select 'Best Rated' as Chosen, ratings.imdbID as imdbID, title, poster, NULL as Likes, Average, Raters, recency from ratings
left join (select avg(rating) as Average, count(imdbID) as Raters, imdbID FROM ratings group by imdbID) aRating
on ratings.imdbID = aRating.imdbID GROUP BY ratings.imdbID ORDER BY Average DESC, recency DESC LIMIT 6)
;
-- Homepage - Best and Recent
select * from
((select "Like" as Chosen , likes.imdbID, title, poster, count(*) as Likes, NULL as username, NULL as rating, NULL as textbox, NULL as Average, NULL as Raters, max(recency) as recency
from likes group by imdbID LIMIT 6)
union all
(select "Rate" as Chosen, ratings.imdbID, title, poster, NULL as Likes, username, rating, textbox, Average , NULL as Raters, recency 
from ratings
left join (select imdbID, avg(rating) as Average from ratings group by imdbID) aRating
ON ratings.imdbID = aRating.imdbID LIMIT 6) order by recency) a
UNION ALL
select * from
((select 'Most Liked' as Chosen,likes.imdbID as imdbID, title, poster, Likes, NULL as username, NULL as rating, NULL as textbox,NULL as Average, NULL as Raters, recency from likes
left join (select count(imdbID) as Likes, imdbID from likes group by imdbID) tLikes 
on tLikes.imdbID = likes.imdbID GROUP BY likes.imdbID ORDER BY Likes DESC, recency DESC LIMIT 6)
UNION ALL
(select 'Best Rated' as Chosen, ratings.imdbID as imdbID, title, poster, NULL as Likes, NULL as username, NULL as rating, NULL as textbox,Average, Raters, recency from ratings
left join (select avg(rating) as Average, count(imdbID) as Raters, imdbID FROM ratings group by imdbID) aRating
on ratings.imdbID = aRating.imdbID GROUP BY ratings.imdbID ORDER BY Average DESC, recency DESC LIMIT 6)) b