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

var querystring = require('querystring');

function BodyParameterParser() {

}

BodyParameterParser.prototype._unserializeParameters = function _unserializeParameters(collection) {
    for (var key in collection) {
        if (collection.hasOwnProperty(key)) {
            var data;
            try {
                data = JSON.parse(collection[key]);
            } catch (e) {
                data = collection[key];
            }
            collection[key] = data;
        }
    }
    return collection;
};

BodyParameterParser.prototype.parse = function parse(body) {
    if (body instanceof Object) return body;
    try
    {
        return JSON.parse(body);
    } catch(e)
    {
        var parameters = querystring.parse(body);
        return this._unserializeParameters(parameters);
    }
};

module.exports = BodyParameterParser;
