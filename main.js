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
        `select f.TITLE, TO_CHAR(f.RELEASE_DATE,'DD-MM-YYYY') as RELEASE_DATE, act.ROLE
        from humans h, actors act, films f
        where h.ID_HUMAN = `+reqId+`
        and act.ID_HUMAN = h.ID_HUMAN
        and act.ID_FILM = f.ID_FILM`,
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
        `select r.REVIEW_TEXT, r.MARK
        from reviews r, films f
        where f.id_film = r.ID_FILM
        and r.ID_FILM = ` + reqId,
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