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

var HttpEventParser = require('./httpEventParser.js'),
    ServiceResponse = require('./serviceResponse.js');
var log2out = require('log2out');

function WebServer(restController, port, server, httpEventParser) {
    this.httpEventParser = httpEventParser || new HttpEventParser();
    this.server = server || require('http').createServer();
    this.restController = restController;
    this.port = port;
    this.logger = log2out.getLogger('RestUtils.WebServer');
}

WebServer.prototype.listen = function() {
    var self = this;
    this.server.listen(this.port, function () {
        self.logger.info('Listening on %j', self.server.address());
    });
    this.server.on('request', function(req, res) {
        self.logger.info('Request: ' + req.url);
        self.httpEventParser.parse(req, function(requestJson) {
            self.restController.handle(requestJson, self.createServiceResponse(res));
        }, this);
    });
};

WebServer.prototype._dispatchResponse = function(res, code, message, encoding) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", encoding);
    res.statusCode = code;
    res.end(message);
};

WebServer.prototype.createServiceResponse = function(res) {
    return new ServiceResponse(function(returnValue) {
        this._dispatchResponse(res, returnValue.code, returnValue.data, returnValue.encoding);
    }, this, function(errCode, errMessage, encoding) {
        this._dispatchResponse(res, errCode, errMessage, encoding);
    });
};

WebServer.prototype.stop = function() {
    if (this.server) {
        this.server.close();
    }
};

module.exports = WebServer;
