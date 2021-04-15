-- Inserting Sample Users
INSERT INTO users (userID,username,email,pswrd) VALUES 
(),
(),
(),
(),
()
;

INSERT INTO likes (userID,imdbID,title,poster,recency) VALUES 
(1,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(2,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(3,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(1,'tt0974661','17 Again','https://m.media-amazon.com/images/M/MV5BMjA2NTI1Mzg3N15BMl5BanBnXkFtZTcwMjYwNjAzMg@@._V1_SX300.jpg',NOW());

INSERT INTO ratings (userID,username,imdbID,title,poster,rating,recency,textbox) VALUES 
(1,'Jefferson','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",7,NOW(),"This is the best James Bond Movie."),
(2,'CoolDude42','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",1,NOW(),"What a waste of time."),
(3,'Imafan','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",10,NOW(),"This is the only movie that needs to exist."),
(1,'Jefferson','tt0791201','VeggieTales: Lord of the Beans','https://m.media-amazon.com/images/M/MV5BODk3NzA1MjI2M15BMl5BanBnXkFtZTcwMjg4NDUzMQ@@._V1_SX300.jpg',10,NOW(),"Veggietales is the reason why I continue to exist on this mediocre planet."),
(3,'Imafan','tt0974661','17 Again','https://m.media-amazon.com/images/M/MV5BMjA2NTI1Mzg3N15BMl5BanBnXkFtZTcwMjYwNjAzMg@@._V1_SX300.jpg',4,NOW(),NULL)