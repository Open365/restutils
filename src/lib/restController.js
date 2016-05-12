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

var RequestParser = require('./requestParser.js');
var ServiceResponse = require('./serviceResponse.js');
var AuthFilterByCard = require('./AuthFilterByCard');

var RestController = function(fpRequest, context, requestParser, authFilter) {
    this.requestParser = requestParser || new RequestParser();
    this.fpRequest = fpRequest;
    this.context = context;
	this.authFilter = authFilter || new AuthFilterByCard();
};

RestController.prototype.setRequestParser = function setRequestParser(requestParser) {
    this.requestParser = requestParser;
};

RestController.prototype.handle = function(serializedRequest, response) {
    var analyzedRequest = this.requestParser.parse(serializedRequest);
    var httpResponse = this.createServiceResponse(response);
	if (this.authFilter.filter(analyzedRequest, httpResponse)) {
		return;
	}

    this.fpRequest.call(this.context, analyzedRequest, httpResponse);
};

RestController.prototype.createServiceResponse = function(outerResponse){
    var self = this;
    return new ServiceResponse(function(returnValue, encodingType) {
        outerResponse.end(self.createHttpResponse(200, returnValue, encodingType));
    }, this, function(errCode, errDescription, encodingType){
        outerResponse.end(self.createHttpResponse(errCode, errDescription, encodingType));
    });
};

RestController.prototype.createHttpResponse = function(errCode, returnValue, encodingType) {
    return {
        "code": errCode,
        "data": JSON.stringify(returnValue),
        "encoding": encodingType
    };
};

module.exports = RestController;
