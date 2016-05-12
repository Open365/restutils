/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var http = require('http');
var Server = require('../src/lib/Server');
var FilterNothing = require('../src/lib/AuthFilterNothing');

var amqpSettings = {
	type: "amqp",
	hosts: 'localhost:5672', //'192.168.7.39',
	queue: {
		name: 'httpForwardExample.v1',
		durable: true,
		exclusive: false,
		autoDelete: false
	},
	subscription: {
		ack: false
	}
};

var httpSettings = {
	hostname: 'localhost',
	port: 9615
};

var server = http.createServer(function (req, res) {
  res.writeHead(201, {'Content-Type': 'text/plain'});
  res.end("foo bar foo2!");
}).listen(9615);

server.on('listening', function() {
	/*
	 *  ACTUAL EXAMPLE CODE, THE REST IS JUST RUBBISH
	 */
	var HTTPRouter = require('../src/lib/routers/HTTPRouter');
	var httpRouter = new HTTPRouter(httpSettings);
	var server = new Server(httpRouter, amqpSettings, new FilterNothing());
	server.start();
});