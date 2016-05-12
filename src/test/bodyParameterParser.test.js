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

/**
 * Created by eyeos on 27/08/14.
 */
var BodyParameterParser = require("../lib/bodyParameterParser");
var expect = require("chai").expect;
suite("BodyParameterParser", function () {
    suite("parse", function () {
        var sut;
        var expected;

        setup(function()
        {
            sut = new BodyParameterParser();
            expected = {
                "params": {
                    "data": {
                        "path": "home:///"
                    },
                    "nElements": 50,
                    "start": 0
                }
            };
        });
        function exerciseParse(inputParams) {
            var actual = sut.parse(inputParams);
            return actual;
        }

        suite("when parameters arrive in compliance with eyeos legacy conventions", function () {
            suite(" AND the body is a string", function()
            {
                test("should parse json parameters correctly", function () {
                    var inputParams = "params=%7B%22data%22%3A%7B%22path%22%3A%22home%3A%2F%2F%2F%22%7D%2C%22start%22%3A0%2C%22nElements%22%3A50%7D";
                    var actual = exerciseParse(inputParams);
                    expect(actual).to.eql(expected);
                });
            });
            suite(" AND the body is already a JSON object", function()
            {
                test("should leave the body unchanged", function () {
                    var actual = exerciseParse(expected);
                    expect(actual).to.eql(expected);
                });

            });
        });
        suite("when parameters arrive as plain json string", function () {
            test("should serialize to normal json object", function()
            {
                var inputParams = '{"params": {"data": {"path": "home:///"},"nElements": 50,"start": 0}}';
                var actual = exerciseParse(inputParams);
                expect(actual).to.eql(expected);
            }); 
        });
    });
});