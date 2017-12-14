'use strict';

var request = require('request');
var atobObj = require('atob');

const endpoint_url = process.env['ENDPOINT_URL'];
const dev_id = process.env['VOICEIT_DEV_ID'];

var responseBody = {
    message: 'Hello back with audio blob from Lambda!',
};

module.exports.handler = (event, context, callback) => {
    console.log('request body:', event);
    try {
        console.log('converting to byteArray...');
        var byteCharacters = atobObj(event.body);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        console.log('byteArray is :', byteArray);
        request({
            headers: {
                'PlatformID': '5',
                'Content-Type': 'audio/wav',
                'UserId': event.headers.userid,
                'VsitPassword': event.headers.password,
                'VsitDeveloperId': dev_id,
                'ContentLanguage': event.headers.language
            },
            uri: endpoint_url,
            body: byteArray,
            method: 'POST'
        }, function (error, response, body) { 
                if(error){
                    console.log('Error response received from VoiceIt');
                    returnErrorMessage(error);
                }
                console.log('response from VoiceIt:' + JSON.stringify(response));
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
    catch (err) {
        console.log('Error while invoking VoiceIt enrollment API:', err);
        returnErrorMessage(err);
    }

};

function returnErrorMessage(err){
    responseBody.message = err;
    const errorified = {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(responseBody)
    }
    callback(
        null,
        errorified
    );
}
