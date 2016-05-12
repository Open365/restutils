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

var Server = require('./Server');
var HTTPRouter = require('./routers/HTTPRouter');
var AuthFilterNothing = require('./AuthFilterNothing');

var AmqpToHttp = function(fromAmqpSettings, toHttpSettings) {
	this.fromAmqpSettings = fromAmqpSettings;
	this.toHttpSettings = toHttpSettings;
};

AmqpToHttp.prototype.start = function() {
	var httpRouter = new HTTPRouter(this.toHttpSettings);
	var server = new Server(httpRouter, this.fromAmqpSettings, new AuthFilterNothing());
	server.start();
};

module.exports = AmqpToHttp;