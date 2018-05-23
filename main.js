var express = require('express');
var oracledb = require('oracledb');
var app = express();
var bodyParser = require('body-parser');
//const database_ex = require('./database_ex.js');
var connectionAttr = {
      user          : "SYSTEM",
      password      : "1",
      connectString : "localhost/XE"
    };

app.get('/', function (req, res) {
    console.log(req.url);
    res.append('Content-type','text/JSON');
    res.append('Access-Control-Allow-Origin','*');
    oracledb.outFormat = oracledb.OBJECT;
    oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `select f.ID_FILM, f.title, TO_CHAR(f.RELEASE_DATE,'DD-MM-YYYY') as RELEASE_DATE, 
        h.name ||' '|| h.SURNAME as director
         from films f, humans h
         where h.id_human = f.id_human`,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/actors', function(req, res) {
    console.log(req.url);
	let qRes;
    res.append('Content-type','text/JSON');
    res.append('Access-Control-Allow-Origin','*');
    oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `select distinct h.NAME, h.SURNAME, h.ID_HUMAN, TO_CHAR(h.DOB,'DD-MM-YYYY') as DOB
         from actors act, humans h
         where act.ID_HUMAN = h.id_human`,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/actors/info_films/:id', function(req, res) {
    console.log(req.url);
    console.log('Id humana: '+req.params.id);
    let reqId = req.params.id;
    let qRes;
    res.append('Content-type','text/JSON');
    res.append('Access-Control-Allow-Origin','*');
    oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `select res.title, res.release_date, res.role, cats.DESCRIPTION
          from
          (select title, release_date, role, o.ID_CATEGORY
              from
                  (select f.TITLE, TO_CHAR(f.RELEASE_DATE,'DD-MM-YYYY') as RELEASE_DATE, act.ROLE, f.id_film as idfilm, h.id_human as human
                  from humans h, actors act, films f
                  where h.ID_HUMAN = `+reqId+`
                  and act.ID_HUMAN = h.ID_HUMAN
                  and act.ID_FILM = f.ID_FILM) 
                  left outer join oscars o on o.ID_FILM=idfilm and o.id_human = human) res
                  left outer join CATEGORIES cats on cats.ID_CATEGORY=res.ID_CATEGORY`,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/actors/more_5_oscars', function(req, res) {
    console.log(req.url);
    let qRes;
    res.append('Content-type','text/JSON');
    res.append('Access-Control-Allow-Origin','*');
    oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `select h.surname, h.name, h.DOB 
          from Humans h, Actors a 
          where a.id_human = h.id_human and a.id_film 
          in 
          (select id_film as film 
          from (select id_film, count(id_category) count1 
          from Oscars 
          group by id_film ) count2 
          where count2.count1>=3 ) 
          group by h.surname, h.DOB, h.name `,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/films/info_review/:id', function(req, res) {
    console.log(req.url);
    console.log('Id film: '+req.params.id);
    let reqId = req.params.id;
    let qRes;
    res.append('Content-type','text/JSON');
    res.append('Access-Control-Allow-Origin','*');
    oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        `select r.id_review, r.REVIEW_TEXT, r.mark, h.name, h.surname
                from reviews r, humans h, films f
                where r.ID_HUMAN=h.ID_HUMAN
                AND f.ID_FILM = r.ID_FILM
                AND r.ID_FILM=` + reqId,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

var jsonParser =  bodyParser.json({type: '*/*'});

app.post('/films/add_review', jsonParser, function (req, res) {
    console.log(req.url);
    console.log(req.body);
    res.append('Access-Control-Allow-Origin','*');
    res.append('Content-type','text/JSON');
    oracledb.autoCommit = true;
    oracledb.outFormat = oracledb.OBJECT;
    const a = `INSERT INTO "SYSTEM"."REVIEWS" (ID_FILM, ID_HUMAN, REVIEW_TEXT, MARK) 
        VALUES ('`+ req.body.film_id +`', '`+ req.body.user_id +`', '`+ req.body.reviewText +`', '`+ req.body.reviewMark +`')`;
    console.log(a);
    oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(a,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send('SUCCESS!');
          connection.release();
        });
    });
});

app.listen(8020, function () {
  console.log('Server listening on port 8020!');
});


app.get('/reviews', function (req, res) {
    console.log(req.url);
    res.append('Access-Control-Allow-Origin','*');
    res.append('Content-type','text/JSON');
    oracledb.autoCommit = true;
    oracledb.outFormat = oracledb.OBJECT;
    const a = `select r.id_review, r.REVIEW_TEXT, r.mark, f.TITLE, h.name, h.surname
                from reviews r, humans h, films f
                where r.ID_HUMAN=h.ID_HUMAN
                AND f.ID_FILM = r.ID_FILM`;
    oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(a,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/reviews/top', function (req, res) {
    console.log(req.url);
    res.append('Access-Control-Allow-Origin','*');
    res.append('Content-type','text/JSON');
    oracledb.autoCommit = true;
    oracledb.outFormat = oracledb.OBJECT;
    const a = `select * from 
              (select TRUNC(AVG(r.mark),1) as aveMark, h.SURNAME, h.name 
              from reviews r, humans h
              where r.ID_HUMAN = h.ID_HUMAN
              group by (h.SURNAME, h.name)
              order by 1)
              where rownum <5`;
    oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(a,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});

app.get('/oscars/:id', function (req, res) {
    console.log(req.url);
    let reqId = req.params.id;
    let qRes;
    console.log('Id CATEGORY = ' + reqId);
    res.append('Access-Control-Allow-Origin','*');
    res.append('Content-type','text/JSON');
    oracledb.autoCommit = true;
    oracledb.outFormat = oracledb.OBJECT;
    const a = `select h.name, h.surname, c.description, count(h.ID_HUMAN) as cnt
                from humans h, oscars o, categories c 
                where h.id_human=o.id_human and o.ID_CATEGORY=c.ID_CATEGORY and o.ID_CATEGORY=`+reqId+` 
                group by h.name,h.SURNAME, c.DESCRIPTION 
                order by 4 desc`;
    oracledb.getConnection(connectionAttr,
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(a,
        function(err, result)
        {
          if (err) { console.error(err); return; }
          res.send(JSON.stringify(result.rows));
          connection.release();
        });
    });
});
// актеры больше 3 оскаров
// select surname, h.DOB 
// from Humans h, Actors a 
// where a.id_human = h.id_human and a.id_film 
// in 
// (select id_film as film 
// from (select id_film, count(id_category) count1 
// from Oscars 
// group by id_film ) count2 
// where count2.count1>=3 ) 
// group by surname, h.DOB;

