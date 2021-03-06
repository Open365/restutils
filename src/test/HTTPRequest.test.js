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
var sinon = require('sinon');
var assert = require('chai').assert;
var HTTPRequest = require('../lib/routers/HTTPRequest');

suite('HTTPRequest', function(){
	var sut;

	var port = 49999;
	var path = '/super/path';
	var method = 'GET';

	suiteSetup(function(done) {
		function createWebServer(done) {
			port++;
			var server = http.createServer(function (req, res) {
				var response = 'bad';
				if (req.url == path && req.method == method) {
					response = 'good';
				}
				res.end(response);
			}).listen(port);

			server.on('listening', function() {	
				done();
			});
			server.on('error', function() {
				setImmediate(createWebServer, done);
			});
		}
		createWebServer(done);
	});

	setup(function(){
		var options = {
			hostname: 'localhost',
			port: port,
			path: path,
			method: method,
			body: 'Here goes a body!'
		};
		sut = new HTTPRequest(options);
	});

	suite('#send', function(){
		test('description', function(done){
			sut.send(function(statusCode, body) {
				assert.equal(statusCode, 200);
				assert.equal(body, 'good');
				done();
			});
		});
	});
});