const http = require('http');
const database_ex = require('./database_ex.js');
const port = 3000;
const requestHandler = (request, response) => {
    console.log(request.url);
    console.log(parseQueryResult());
    response.write(generateList());
    response.end('Hello Node.js Server!');
}
const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
function parseQueryResult() {
  var qResult = database_ex.fuck();
  return qResult;
}

function generateList(queryResult) {
  var template = '<br>';
  for (var i in parseQueryResult()) {
    console.log(i);
       template += parseQueryResult()[i].SURNAME + '<br>';
    }
    console.log(template);
  return decodeURI(template);
}
