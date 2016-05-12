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

var AMQPServer = require("./AMQPServer.js");
var AuthFilterNothing = require('../../AuthFilterNothing');
var NullRequestParser = require("../../nullRequestParser.js");

function AMQPServerAdapter(restController, amqpConnectionSettings) {
    var self = this;
    this._restController = restController;
    this._restController.setRequestParser(new NullRequestParser());
    this._settings = amqpConnectionSettings;
    this._router = {
        dispatch: function(analyzedRequest, amqpResponse) {
            self._restController.handle(analyzedRequest, amqpResponse);
        }
    };
    this._innerServer = this._constructServer(this._router, this._settings);
}

AMQPServerAdapter.prototype.setInnerServer = function setInnerServer(innerServer) {
    this._innerServer = innerServer;
};

AMQPServerAdapter.prototype._constructServer = function(router, settings) {
	//We do not filter anything here since RestController will do it for us
    return new AMQPServer(this._router, new AuthFilterNothing(), this._settings);
};

AMQPServerAdapter.prototype.listen = function() {
    this._innerServer.start();
};

module.exports = AMQPServerAdapter;
