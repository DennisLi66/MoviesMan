
-- Most Highly Rated Movies
select 'High Rating' as Rule, avg(rating),imdbID from ratingsList group by imdbID;
-- Most Well Liked movies

select 'High Likes' as Rule, imdbID, count(imdbID) as Likes from likeList group by imdbID ORDER BY Likes Desc;

select 'Recent Likes' as Rule, imdbID, recency,  count(imdbID) as Likes from recentLikes group by imdbID ORDER BY recency Desc;

select 'Recent Ratings' as Rule;

select * from recentReviews