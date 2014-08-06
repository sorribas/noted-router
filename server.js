var net = require('net');
var seaport = require('seaport');
var http = require('http');
var httpProxy = require('http-proxy');
var param = require('param');

var proxy = httpProxy.createProxyServer();
var ports = seaport.createServer();
ports.listen(param('seaport-port'));

var server = http.createServer(function(req, res) {
  var urlArr = req.url.split('/');
  urlArr.shift();
  var part = urlArr.shift();
  var ps = {length: false}, service = '';
  do {
    service += service ? ('/' + part) : part;
    if (service) ps = ports.query(service);
  } while (!ps.length && (part = urlArr.shift()));

  if (!ps.length) ps = ports.query('app');
  proxy.web(req, res, {target: ps[Math.floor(Math.random() * ps.length)]});
});
server.listen(param('port'), function() {
  console.log('NotEd registry listening on port ' + server.address().port);
});
