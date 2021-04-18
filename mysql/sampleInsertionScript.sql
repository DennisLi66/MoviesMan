use movieManDB;
truncate table likes;
truncate table rates;
-- Inserting Sample Users
INSERT INTO users (userID,username,email,pswrd) VALUES 
(1,'Jefferson','jeffersonBezos@moviesman.net','$2b$10$Ye.G0y/Ni4cVM3.6i9zAj.uCUl2n2jrHdzqCWVEZMKkDqSsweWMIS'),
(2,'CoolDude42','cooldude42@moviesman.net','$2b$10$e1Dc6TDXO9nGdRP6MvFnu.TAXw.o.JjevdYt9oN3pTjT/9UiPfOCC'),
(3, 'Imafan','fannyfan@moviesman.net'),
(4,'ian','ians@moviesman.net'),
(5,'flogressive','flo@moviesman.net')
;


INSERT INTO likes (userID,imdbID,title,poster,recency) VALUES 
(1,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(1,	'tt4972582'	,'Split',	 'https://m.media-amazon.com/images/M/MV5BZTJiNGM2NjItNDRiYy00ZjY0LTgwNTItZDBmZGRlODQ4YThkL2ltYWdlXkEyXkFqcGdeQXVyMjY5ODI4NDk@._V1_SX300.jpg', NOW() - Interval 2 Month),
(1,	'tt0115942','Conundrum','https://m.media-amazon.com/images/M/MV5BMTg2MzYyNTcxOV5BMl5BanBnXkFtZTYwNTU5MTY5._V1_SX300.jpg', NOW() ),
(1,'tt0974661','17 Again','https://m.media-amazon.com/images/M/MV5BMjA2NTI1Mzg3N15BMl5BanBnXkFtZTcwMjYwNjAzMg@@._V1_SX300.jpg',NOW()),
(2,	'tt4972582'	,'Split',	 'https://m.media-amazon.com/images/M/MV5BZTJiNGM2NjItNDRiYy00ZjY0LTgwNTItZDBmZGRlODQ4YThkL2ltYWdlXkEyXkFqcGdeQXVyMjY5ODI4NDk@._V1_SX300.jpg', NOW() - Interval 1 Hour),
(2,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(3,'tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",NOW()),
(3,	'tt1392170'	,'The Hunger Games','https://m.media-amazon.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_SX300.jpg', NOW()),
(4,	'tt4972582'	,'Split',	 'https://m.media-amazon.com/images/M/MV5BZTJiNGM2NjItNDRiYy00ZjY0LTgwNTItZDBmZGRlODQ4YThkL2ltYWdlXkEyXkFqcGdeQXVyMjY5ODI4NDk@._V1_SX300.jpg', NOW()- Interval 1 Second ),
(4,'tt0066769','The Andromeda Strain','https://m.media-amazon.com/images/M/MV5BYzY4NGZkOTMtNTRjNy00NWY4LWI2ZmUtODc3NWY3MTBhNzE2XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',Now() - Interval 1 DAY) ,
(5,	'tt1392170'	,'The Hunger Games',	 'https://m.media-amazon.com/images/M/MV5BMjA4NDg3NzYxMF5BMl5BanBnXkFtZTcwNTgyNzkyNw@@._V1_SX300.jpg', NOW() - Interval 50 Day),
(5,	'tt4972582'	,'Split',	 'https://m.media-amazon.com/images/M/MV5BZTJiNGM2NjItNDRiYy00ZjY0LTgwNTItZDBmZGRlODQ4YThkL2ltYWdlXkEyXkFqcGdeQXVyMjY5ODI4NDk@._V1_SX300.jpg', NOW() + Interval 1 Second)


;

INSERT INTO ratings (userID,username,imdbID,title,poster,rating,recency,textbox) VALUES 
(1,'Jefferson','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",7,NOW(),"This is the best James Bond Movie."),
(1,'Jefferson','tt0791201','VeggieTales: Lord of the Beans','https://m.media-amazon.com/images/M/MV5BODk3NzA1MjI2M15BMl5BanBnXkFtZTcwMjg4NDUzMQ@@._V1_SX300.jpg',10,NOW(),"Veggietales is the reason why I continue to exist on this mediocre planet."),
(2,'CoolDude42','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",1,NOW(),"What a waste of time."),
(3,'Imafan','tt0830515',"Quantum of Solace","https://m.media-amazon.com/images/M/MV5BMjZiYTUzMzktZWI5Yy00Mzk4LWFlMDgtYjRmNWU0Mzc0MzNiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",10,NOW(),"This is the only movie that needs to exist."),
(3,'Imafan','tt0974661','17 Again','https://m.media-amazon.com/images/M/MV5BMjA2NTI1Mzg3N15BMl5BanBnXkFtZTcwMjYwNjAzMg@@._V1_SX300.jpg',4,NOW(),NULL)
