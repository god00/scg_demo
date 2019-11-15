var express = require('express');
var router = express.Router();
var apiRoute = require('./api/restapi.route');

router.use('/', apiRoute);

module.exports = router;