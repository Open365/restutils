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

var Server = require('./lib/Server');
var WebServer = require('./lib/webServer.js');
var AMQPServerAdapter = require("./lib/implementations/amqp/AMQPServerAdapter.js");
var RequestParser = require('./lib/requestParser.js');
var BodyParameterParser = require('./lib/bodyParameterParser.js');
var RestController = require('./lib/restController.js');
var ServiceResponse = require("./lib/serviceResponse.js");
var ServerFactory = require("./lib/ServerFactory.js");
var AuthFilterNothing = require('./lib/AuthFilterNothing');
var AmqpToHttp = require('./lib/AmqpToHttp');

var exportedLibraries = {
	"Server": Server,
	"AmqpToHttp": AmqpToHttp,
	"WebServer": WebServer,
	"RestController": RestController,
	"RequestParser": RequestParser,
	"ServiceResponse": ServiceResponse,
    "AMQPServerAdapter" : AMQPServerAdapter,
	"ServerFactory" : ServerFactory,
    "BodyParameterParser": BodyParameterParser,
	"AuthFilterNothing": AuthFilterNothing
};

module.exports = exportedLibraries;
