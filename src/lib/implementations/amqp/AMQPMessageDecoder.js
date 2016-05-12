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

var RequestParser = require("../../requestParser.js");

var AMQPMessageDecoder = function(JSONArg) {
	this.json = JSONArg || new RequestParser();
};

AMQPMessageDecoder.prototype.decode = function(msg) {
    //@TODO This is a dirty hack and needs to be fixed as soon as possible
    var string = "";
    if (msg.data) {
        string = msg.data.toString('utf-8');
    } else {
        string = msg;
    }
	var json = this.json.parse(string);
	return json;
};

module.exports = AMQPMessageDecoder;
