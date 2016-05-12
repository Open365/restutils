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

var Server = require("../lib/Server");
var WebServer = require("../lib/webServer.js");
var AMQPServerAdapter = require("../lib/implementations/amqp/AMQPServerAdapter.js");
var ServerFactory = {
	getServer: function getServer(router, serverSettings, authFilter) {
		return new Server(router, serverSettings, authFilter);
	},
	constructServer: function constructServer(restController, connectionSettings) {
		var _typeMap = {
			'http': this._constructWebServer,
			'bus': this._constructBusListener
		};
		if(!connectionSettings.type || !_typeMap [connectionSettings.type]) {
			return this._constructWebServer(restController, connectionSettings);
		} else {
			return _typeMap[connectionSettings.type](restController, connectionSettings);
		}
	},
	_constructWebServer: function(restController, connectionSettings) {
		return new WebServer(restController, connectionSettings.port);
	},
	_constructBusListener: function(restController, connectionSettings) {
		return new AMQPServerAdapter(restController, connectionSettings);
	},

};

module.exports = ServerFactory;