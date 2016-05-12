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

var EyeosAuth = require('eyeos-auth');
var log2out = require('log2out');

var AuthFilterByCard = function(eyeosAuth) {
	this.eyeosAuth = eyeosAuth || new EyeosAuth();
	this.logger = log2out.getLogger('AuthFilterByCard');
};

AuthFilterByCard.prototype.filter = function(request, response) {
	this.logger.debug('.filter: checking if requests auth is correct');
	var isValid = this.eyeosAuth.verifyRequest(request);
	if (!isValid) {
		this.logger.debug('.filter: Card is incorrect, returning 403');
		response.fail(403, 'Invalid auth card');
		return true;
	}

	this.logger.debug('.filter: card is correct');
	return false;
};

module.exports = AuthFilterByCard;