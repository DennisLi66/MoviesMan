      SELECT * FROM
      (select userID,username, email from users ) info
      LEFT JOIN
      (select "Liked" as Chosen, email, poster, likeList.imdbID, movieName as title, NULL as rating, NULL as textbox, recency
      from likelist left join recentLikes on likeList.imdbID = recentLikes.imdbID
      UNION
      select "Rated" as Chosen, email, poster, ratingsList.imdbID, movieName as title, ratingsList.rating, ratingsList.textbox, recency
      from ratingsList left join recentReviews on recentReviews.imdbID = ratingsList.imdbID) lists
      ON lists.email = info.email ORDER BY recency
      ;
            SELECT * FROM
      (select userID,username, email from users where userID = ?) info
      LEFT JOIN
      (select "Liked" as Chosen, users.email as email, poster, likeList.imdbID, movieName as title, NULL as rating, NULL as textbox, recency
      from likelist left join users on users.email = likeList.email left join recentLikes on likeList.imdbID = recentLikes.imdbID AND recentLikes.userID = users.userID
      UNION
      select "Rated" as Chosen, users.email as email, poster, ratingsList.imdbID, movieName as title, ratingsList.rating, ratingsList.textbox, recency
      from ratingsList left join users on users.email = ratingsList.email left join recentReviews on recentReviews.imdbID = ratingsList.imdbID AND recentReviews.userID = users.userID
      ) lists
      ON lists.email = info.email ORDER BY recency