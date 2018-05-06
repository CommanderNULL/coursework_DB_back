var express = require('express');
var oracledb = require('oracledb');
var app = express();
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
        `select f.title, f.RELEASE_DATE, h.name ||' '|| h.SURNAME as director
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
        `select h.NAME, h.SURNAME, act.ROLE
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

app.listen(8020, function () {
  console.log('Server listening on port 8020!');
});