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

var HTTPRequest = require('./HTTPRequest');

var HTTPRequestMarshaller = function(settings) {
	this.settings = settings;
};

HTTPRequestMarshaller.prototype.getRequest = function(restUtilsRequest) {
	var query = '';
	if (restUtilsRequest.rawQuery) {
		query = '?' + restUtilsRequest.rawQuery
	}
	var options = {
		path: restUtilsRequest.userPath + query,
		method: restUtilsRequest.method,
		headers: restUtilsRequest.headers,
		hostname: this.settings.hostname,
		port: this.settings.port
	};

	if(typeof restUtilsRequest.document === "object") {
		options.body = JSON.stringify(restUtilsRequest.document);
		options.headers['content-type'] = 'application/json';
	} else {
		options.body = restUtilsRequest.document;
	}

	if (options.body && options.body.length) {
		options.headers['content-length'] = Buffer.byteLength(options.body, 'utf8');
	}

	var httpRequest = new HTTPRequest(options);
	return httpRequest;
};

module.exports = HTTPRequestMarshaller;
