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

var BodyParameterParser = require('./bodyParameterParser');
var path = require('path'),
    querystring = require('querystring');

function RequestParser(bodyParser) {
    this.bodyParser = bodyParser || new BodyParameterParser();
}

RequestParser.prototype.parse = function(serializedRequest) {
    var jsonRequest = JSON.parse(serializedRequest);
	//path ~ /api/v1.0/serviceName/...
    var pathArray = jsonRequest.url.split(path.sep);

	//We filter out everything that evaluates to false
	pathArray = pathArray.filter(function(e){return e;});

	var service = pathArray.shift();
	var version = pathArray.shift();

	var parameters;
	if (pathArray.length > 0) {
		parameters = {};

		var key, value;
		for (var i = 0; i < pathArray.length; i++) {
			key = pathArray[i];
			value = pathArray[++i];

			parameters[key] = value;
		}
	}

	var userPath = '/' + pathArray.join('/');

	var msg = {
        "service": service,
        "headers": jsonRequest.headers,
        "method": jsonRequest.method,
        "version": version,
		"path": jsonRequest.url,
		"userPath": userPath
    };

	if (parameters) {
		msg.parameters = parameters;
	}

	if (jsonRequest.body) {
		msg.document = this.bodyParser.parse(jsonRequest.body);
	}

    if (jsonRequest.document) {
        msg.document = this.bodyParser.parse(jsonRequest.document);
    }

	if (jsonRequest.query) {
		msg.rawQuery = jsonRequest.query;
		msg.query = querystring.parse(jsonRequest.query);
	}

    return msg;
};

module.exports = RequestParser;
