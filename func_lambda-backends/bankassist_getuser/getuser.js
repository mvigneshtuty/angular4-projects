'use strict';

var request = require('request');
var crypto = require('crypto-js');

const endpoint_url = process.env['ENDPOINT_URL'];
const dev_id = process.env['VOICEIT_DEV_ID'];

module.exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log('UserId in request header:' + event.headers.userid);
    var password = getSHA256(event.headers.password);
    request({
        headers: {
            'PlatformID': '5',
            'Content-Length': '0',
            'Content-Type': 'application/json',
            'UserId': event.headers.userid,
            'VsitPassword': password,
            'VsitDeveloperId': dev_id
        },
        uri: endpoint_url,
        body: '',
        method: 'GET'
    }
        , function (error, response, body) {
            const respified = {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(response)
            }
            callback(
                null,
                respified
            );
        });
}

function getSHA256(passwd) {
    //var hash = crypto.createHash('sha256').update(passwd).digest('hex');
    var hash = crypto.SHA256(passwd).toString();
    return hash;
}