var net = require('net');
var seaport = require('seaport');
var http = require('http');
var httpProxy = require('http-proxy');
var param = require('param');

var proxy = httpProxy.createProxyServer();
var ports = seaport.createServer();
ports.listen(param('seaport-port'));

var server = http.createServer(function(req, res) {
  var service = req.url.split('/')[1];
  if (!service) service = 'app';
  var ps = ports.query(service);

  if (ps.length === 0) ps = ports.query('app');
  proxy.web(req, res, {target: ps[Math.floor(Math.random() * ps.length)]});
});
server.listen(param('port'), function() {
  console.log('NotEd registry listening on port ' + server.address().port);
});
