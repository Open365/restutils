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

var sinon = require('sinon');
var assert = require('chai').assert;

var Server = require('../lib/Server');
var ServerFactory = require('../lib/ServerFactory.js');
var RestController = require('../lib/restController.js');
var WebServer = require('../lib/webServer.js');
var AMQPServerAdapter = require('../lib/implementations/amqp/AMQPServerAdapter.js');


function getServer() {
	return ServerFactory.getServer();
}
function constructServerType(type) {
	return ServerFactory.constructServer(new RestController(function(){}, this),{
		type:type
	});
}

suite('ServerFactory', function(){

	test("constructServer when type is http will construct a webserver", function() {
		var server = constructServerType("http");
		assert.equal(true, server instanceof WebServer);
	});

	test("constructServer when type is bus will construct an AMQPServerAdapter", function() {
		var server = constructServerType("bus");
		assert.equal(true, server instanceof AMQPServerAdapter);
	});

	test("constructServer when type is not bus nor http will construct a webserver", function() {
		var server = constructServerType("anything");
		assert.equal(true, server instanceof WebServer);
	});

	test("constructServer when type is not present will construct a webserver", function() {
		var server = constructServerType(null);
		assert.equal(true, server instanceof WebServer);
	});

	test('getServer should return an instance of Server', function () {
		var server = getServer();
		assert.instanceOf(server, Server, 'Returned object should be an instance of Server!');

	});
});
