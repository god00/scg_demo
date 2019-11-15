var express = require('express');
const scgCtrl = require('../../controllers/scg.controller');
const lineCtrl = require('../../controllers/line.controller');
const config = require('../../config');

var router = express.Router();

router.post('/line/webhook', lineCtrl.webhook);

router.post('/search', scgCtrl.findValue);

router.get('/restaurants', scgCtrl.findRestaurants);


module.exports = router;