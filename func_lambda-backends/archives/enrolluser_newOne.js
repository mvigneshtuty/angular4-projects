'use strict';

var request = require('request');
var Busboy = require('busboy');

const endpoint_url = process.env['ENDPOINT_URL'];
const dev_id = process.env['VOICEIT_DEV_ID'];

module.exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    console.log('UserId in request header:' + event.headers.userid);
    console.log('Blob in request header:' + event.headers.audiowav);
    console.log('Blob in request Body:' + event.body);
    
    parse(event).then(result => {
        console.log('form data parsed and received')
        console.log('SUCCESS: result :',result)
        const respified = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(result)
        }
        callback(
            null,
            respified
        );
    }).catch(err => {
        console.log('form data parsing failed.');
        console.log('error in JSON:', JSON.stringify(err));
        const errorified = {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(err)
        }
        callback(
            null,
            errorified
        );
    });

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


    function getContentType (event){
        let contentType = event.headers['content-type']
        if (!contentType) {
            return event.headers['Content-Type'];
        }
        return contentType;
    };

    function parse(event) {
        console.log('parsing form data in parser:');
        return new Promise((resolve, reject) => {
            try{
            const busboy = new Busboy({
                headers: {
                    'content-type': 'multipart/form-data',
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
            event.body = result;
            busboy.on('finish', () => resolve(event));

            busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
            busboy.end();
        }
        catch(err){
            throw 'Error from parser :'+err;
        }
        });
    }
}