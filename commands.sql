-- Exercise 2 
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Milla Magia', 'https://fi.wikipedia.org/wiki/Milla_Magia', 'About me', 10);

insert into blogs (url, title) values ('https://fi.wikipedia.org/wiki/Roope_Ankka', 'Scrooge McDuck');