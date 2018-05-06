var oracledb = require('oracledb');
var test_r = 0;
const get_result = function () {
  oracledb.outFormat = oracledb.OBJECT;
  oracledb.getConnection(
    {
      user          : "SYSTEM",
      password      : "1",
      connectString : "localhost/XE"
    },
    function(err, connection)
    {
      if (err) { console.error(err); return; }
      connection.execute(
        "SELECT * "
      + "FROM humans ",
        function(err, result)
        {
          if (err) { console.error(err); return; }
          test_r = result.rows;
        });
    });
    return test_r;
}

module.exports.fuck = ()=> {return get_result()};
