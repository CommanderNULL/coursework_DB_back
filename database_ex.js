var oracledb = require('oracledb');
var test_r = 0;
const get_result = function () {
  oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(
    {
      user          : "STUD",
      password      : "x",
      connectString : "localhost/XE"
    },
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        "SELECT * "
      + "FROM employees "
      + "WHERE id_e<100 AND rownum < 3",
        function(err, result)
        {
          if (err) { console.error(err); return; }
          test_r = result.rows;
        });
    });
    return test_r;
}

module.exports.fuck = ()=> {return get_result()};
