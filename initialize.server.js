var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var helmet = require("helmet")
var parseurl = require('parseurl')
var contentLength = require('express-content-length-validator');
var hpp = require('hpp');
var hsts = require('hsts');
var compression = require('compression')

const server = express();

var config = require('./config')

const MAX_CONTENT_LENGTH_ACCEPTED = 9999;

server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", 'application/json; charset=utf-8');
    res.header('Cache-Control', 'no-cache,no-store,max-age=0,must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '-1');
    // res.header('Strict-Transport-Security', 'max-age=2592000; includeSubDomains; preload');
    res.header('X-XSS-Protection', '1;mode=block');
    res.header('X-Frame-Options', 'deny');
    res.header('X-Content-Type-Options', 'nosniff');
    next();
});

// set proxy
// server.set('trust proxy', config.proxyIp);
server.use(hsts({
    maxAge: 2592000,        // Must be at least 1 year to be approved
    includeSubDomains: true, // Must be enabled to be approved
    preload: true
}))


var logDirectory = path.join(__dirname, "logs");
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'server.log'), { flags: 'a' })

server.use(helmet());
server.use(hpp());
server.use(logger('combined', { stream: accessLogStream }));
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(express.json({ limit: '1mb' }));
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(compression())
server.use(express.static(path.join(path.resolve(__dirname, '../'), 'SCG/build')));   // path to frontend
server.use(contentLength.validateMax({ max: MAX_CONTENT_LENGTH_ACCEPTED, status: 429, message: "stop it!" })); // max size accepted for the content-length

module.exports = server;
