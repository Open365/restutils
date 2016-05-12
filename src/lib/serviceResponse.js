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

var log2out = require('log2out');

function ServiceResponse(fp, context, fpError){
    this.fp = fp;
    this.fpError = fpError || function() {};
    this.context = context;
}

ServiceResponse.BASE_ENCODING = "text/plain";

ServiceResponse.prototype.end = function(response, encodingType) {
    if(!encodingType) encodingType = ServiceResponse.BASE_ENCODING;
    log2out.getLogger().debug('response end: ', response);
    this.fp.call(this.context, response, encodingType);
};

ServiceResponse.prototype.fail = function(errCode, errDescription) {
    log2out.getLogger().error('response fail: ', errCode ,' - ', errDescription);
    this.fpError.call(this.context, errCode, errDescription, ServiceResponse.BASE_ENCODING);
};

ServiceResponse.prototype.reject = function() {
    log2out.getLogger().error('response reject: ');
    this.fail(449, "Retry request");
};

ServiceResponse.prototype.invalidRequest = function(request) {
    this.fail(403, "InvalidRequest:["+JSON.stringify(request)+"]");
};

module.exports = ServiceResponse;
