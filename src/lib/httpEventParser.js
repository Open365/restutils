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

var url = require('url');
/**test build*/
var HttpEventParser = function() {

};

HttpEventParser.prototype.parse = function(req, parseCallback, context) {
    var body = "";
    req.on("data", function(chunk) {
        body += chunk;
    }, this);
    req.on("end", function() {
        var parsed = url.parse(req.url);
        var reqInfo = {
            "url": parsed.pathname,
            "method": req.method,
            "headers": req.headers,
            "body": body
        };
        var query = parsed.query;
        if(query != null && query !== "") {
            reqInfo.query = query;
        }
        parseCallback.call(context, JSON.stringify(reqInfo));
    }, this);
};

module.exports = HttpEventParser;
