var request = require('request');
const config = require('../config');

exports.webhook = (req, res, next) => {
    try {
        let reply_token = req.body.events[0].replyToken;
        let msg = req.body.events[0].message.text;
        reply(reply_token, msg)
        res.sendStatus(200)
    } catch (err) {
        return res.status(400).json({ errorMsg: err });
    }
}

function reply(reply_token, msg) {
    try {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.line.channelAccessToken}`
        }

        let body = JSON.stringify({
            replyToken: reply_token,
            messages: [{
                type: 'text',
                text: "Hello I'm Phosawat's bot"
            },
            {
                type: 'text',
                text: 'See more detail about me (https://drive.google.com/file/d/1ca3m0QGNqL1LELrUAV6ryrhlMQ0neh4d/view?usp=sharing)'
            }]
        })
        request.post({
            url: 'https://api.line.me/v2/bot/message/reply',
            headers: headers,
            body: body
        }, (err, res, body) => {
            console.log('status = ' + res.statusCode);
        });
    }
    catch (e) {
        console.error(e)
    }

}