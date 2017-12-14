'use strict';

var request = require('request');
var atob = require('atob');

//const endpoint_url = process.env['ENDPOINT_URL'];
//const dev_id = process.env['VOICEIT_DEV_ID'];

module.exports.handler = (event, context, callback) => {
    console.log('request body:', event);
    var responseBody={
        message:'Hello back with audio blob from Lambda!',
        blobdata:''
    };
   /* parse(event).then(result => {
        console.log('form data parsed and received')
        console.log('SUCCESS: result :', result)
        responseBody.formdata = result;
        const respified = {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(responseBody)
    }
    callback(
        null,
        respified
    );
    }).catch(err => {
        console.log('form data parsing failed.');
        console.log('error in JSON:', JSON.stringify(err));
        responseBody.formdata = err;
        const respified = {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(responseBody)
    }
    callback(
        null,
        respified
    );
    });
    */
    console.log('converting to byteArray...');
    var byteCharacters = atob(event.body.blobData);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    console.log('byteArray is :', byteArray);
    console.log('converting to Blob...');
    var blob = new Blob([byteArray], {type: 'audio/wav'});
    console.log('retrieved blob is :', blob);
    var arrayBuffer;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        arrayBuffer = this.result;
    };
    fileReader.readAsArrayBuffer(blob);
    console.log('converting to Array buffer...');
    responseBody.blobdata = arrayBuffer;
    console.log('arrayBuffer val is :', arrayBuffer);
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
}

function parse(request) {
    console.log('parsing form data in parser:');
    console.log('content type value :',getContentType(request));
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

            busboy.write(request.body, 'binary');
            busboy.end();
        }
        catch (err) {
            throw 'Error from parser :' + err;
        }
    });
}