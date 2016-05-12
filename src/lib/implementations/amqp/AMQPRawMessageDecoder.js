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

var parser = require('http-string-parser');
var RequestParser = require("../../requestParser.js");

var AMQPRawMessageDecoder = function() {
	this.requestParser = new RequestParser();
};

AMQPRawMessageDecoder.prototype.decode = function(msg) {

	var string = "";
	if (msg.data) {
		string = msg.data.toString('utf-8');
	} else {
		string = msg;
	}

	var request = parser.parseRequest(string);
	var paramsPos = request.uri.lastIndexOf("?");
	var aux;

	if(paramsPos !== -1) { //if params found
		aux = request.uri.substr(1, paramsPos - 1);
	} else {
		aux  = request.uri.substr(1);
	}

	request.url = aux;
	var urlParts = aux.split("/");
	request.query = request.uri.split('?')[1];

	return this.requestParser.parse(JSON.stringify(request));
};

module.exports = AMQPRawMessageDecoder;
