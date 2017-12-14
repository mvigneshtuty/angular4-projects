'use strict';

var request = require('request');
var Busboy = require('busboy');

//const endpoint_url = process.env['ENDPOINT_URL'];
//const dev_id = process.env['VOICEIT_DEV_ID'];

module.exports.handler = (event, context, callback) => {
    console.log('request body:', event);
    var responseBody={
        message:'Hello back!',
        formdata:''
    };
    parse(event).then(result => {
        console.log('form data parsed and received')
        console.log('SUCCESS: result :', result)
        responseBody.formdata = result;
    }).catch(err => {
        console.log('form data parsing failed.');
        console.log('error in JSON:', JSON.stringify(err));
        responseBody.formdata = err;
    });
    
    const respified = {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(responseBody)
    }
    callback(
        null,
        respified
    );
}




/*
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
        body: event.body,
        method: 'POST'
    }
        , function (error, response, body) {
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
        */


function getContentType(request) {
    let contentType = request.headers['content-type']
    if (!contentType) {
        return request.headers['Content-Type'];
    }
    return contentType;
};

function parse(request) {
    console.log('parsing form data in parser:');
    return new Promise((resolve, reject) => {
        try {
            const busboy = new Busboy({
                headers: {
                    'content-type': getContentType(request),
                }
            });
            console.log('busboy initiated:');
            const result = {};

            busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
                file.on('data', data => {
                    console.log('busboy found some data :');
                    result.file = data;
                });

                file.on('end', () => {
                    console.log('end reading the form data :');
                    result.filename = filename;
                    result.contentType = mimetype;
                });
            });

            busboy.on('field', (fieldname, value) => {
                console.log('busboy reading field values in form data :');
                result[fieldname] = value;
            });

            busboy.on('error', error => reject(`Parse error: ${error}`));
            request.body = result;
            busboy.on('finish', () => resolve(request));

            busboy.write(request.body, request.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();
        }
        catch (err) {
            throw 'Error from parser :' + err;
        }
    });
}