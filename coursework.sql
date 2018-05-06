--CREATE TABLE HUMANS (
--    id_human integer,
--    dob date,
--    name varchar(30),
--    surname varchar(30),
--    PRIMARY KEY (id_human)
--)

--CREATE TABLE CATEGORIES (
--        id_category integer,
--        description varchar(100),
--        PRIMARY KEY (id_category)
--)
-- 
-- CREATE TABLE TAG_DESCR (
--        id_tag_type integer,
--        tag_descr varchar(30),
--        PRIMARY KEY (id_tag_type)
-- )

--CREATE TABLE FILMS (
--    id_film integer,
--    title varchar(30),
--    release_date date,
--    PRIMARY KEY (id_film)
--

--CREATE TABLE OSCARS (
--    id_oscar integer not null,
--    PRIMARY KEY (id_oscar)
--)

--CREATE TABLE ACTORS(
--    id_actor integer not null,
--    id_human integer not null,
--    id_film integer not null,
--    role varchar(30) not null,
--    PRIMARY KEY (id_actor),
--    FOREIGN KEY (id_human) REFERENCES humans (id_human)
--)

--CREATE TABLE TAGS (
--    id_tag integer not null,
--    id_tag_type integer not null,
--    id_film integer not null,
--    PRIMARY KEY (id_tag),
--    FOREIGN KEY (id_tag_type) REFERENCES tag_descr (id_tag_type),
--    FOREIGN KEY (id_film) REFERENCES films (id_film)
--)

--CREATE TABLE reviews (
--    id_review integer not null,
--    id_film integer not null,
--    id_human integer not null,
--    review_text varchar(1000),
--    mark integer not null,
--    PRIMARY KEY (id_review),
--    FOREIGN KEY (id_film) REFERENCES films (id_film),
--    FOREIGN KEY (id_human) REFERENCES humans (id_human)
--)

--select f.TITLE, cat.description, rev.id_human, rev.MARK
--from films f, oscars osc, reviews rev, categories cat
--where
--f.id_film = osc.id_film
--AND rev.id_film = f.id_film
--AND cat.id_category = osc.ID_CATEGORY;
--
--select *
--from humans