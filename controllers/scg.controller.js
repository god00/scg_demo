var config = require('../config');
var request = require('request');
const { validate } = require("../services/parameter.service");

const cachingData = {
    findValue: {},
    findRestaurants: {}
};
const INVALID_VALUE = "Invalid Value";
const tmpData = [1, 5, 9, 15, 23, 38, 50] // X=1, Y=38, Z=50

exports.findValue = async (req, res) => {
    try {
        let list = req.body.list;
        if (validate(req.body.list)) {
            if (typeof list === 'string') {
                try {
                    list = JSON.parse(list);
                    if (!Array.isArray(list)) {
                        list = [list];
                    }
                }
                catch (e) {
                    list = list.split(',').map(i => parseFloat(i))
                }
            };
            // start search here...
            const results = [];
            const listTmp = [];
            for (let item of list) {
                if (validate(item)) {
                    listTmp.push(item);
                    if (!validate(cachingData.findValue[item])) {
                        cachingData.findValue[item] = BinarySearchRecursively(tmpData, item, 0, tmpData.length - 1)
                    }
                    results.push(cachingData.findValue[item] !== -1);
                }
            }
            return res.status(200).json({ results, list: listTmp });
        }
        else {
            return res.status(400).json({ errorMsg: INVALID_VALUE });
        }
    } catch (err) {
        return res.status(400).json({ errorMsg: err });
    }
}

exports.findRestaurants = async (req, res, next) => {
    try {
        if (validate(req.query.nearby)) {
            const nearby = req.query.nearby.toLowerCase();
            const url = `${config.googlePlaceEndPoint}${config.textSearchWithquery}restaurants+in+${nearby}&key=${config.googleKey}`;
            if (cachingData.findRestaurants[nearby] != null && cachingData.findRestaurants[nearby].status.toUpperCase() === 'OK') {
                return res.status(200).json(cachingData.findRestaurants[nearby])
            }
            else {
                request.get(url, (error, respone, body) => {
                    if (error) {
                        return res.status(400).json({ errorMsg: error.error_message });
                    }
                    const resBody = JSON.parse(body);
                    cachingData.findRestaurants[nearby] = { results: resBody.results, status: resBody.status };
                    return res.status(200).json(cachingData.findRestaurants[nearby])
                })
            }
        }
        else {
            return res.status(400).json({ errorMsg: INVALID_VALUE });
        }
    } catch (err) {
        return res.status(400).json({ errorMsg: err });
    }
}


/**
 * Binary Search using Recursion
 * p.......q........r : range where p is start, r is end
 * Assume the array is sorted.
 * Procedure BinarySearchRecursively(ArrayGiven, x, p, r, q = 0)
 * if(p > r) return -1
 * q = Math.floor((p+r)/2)
 * if(x === ArrayGiven[q]) return q
 * else if(x > ArrayGiven[q]) set p = q+1
 *    return BinarySearchRecursively(ArrayGiven, x, q + 1, r)
 * else r = q-1 return BinarySearchRecursively(ArrayGiven, x, p, q-1)
 *
 */

function BinarySearchRecursively(ArrayGiven, x, p, r, q = 0) {
    if (p > r) {
        return -1;
    }
    q = Math.floor((p + r) / 2);
    if (x === ArrayGiven[q]) {
        return q;
    }
    if (x > ArrayGiven[q]) {
        return BinarySearchRecursively(ArrayGiven, x, q + 1, r);
    }
    return BinarySearchRecursively(ArrayGiven, x, p, q - 1);
}
// Credit: https://stackoverflow.com/questions/54621363/binary-search-recursively-using-javascript-es6