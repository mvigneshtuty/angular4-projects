'use strict';

var request = require('request');
var atobObj = require('atob');
var uuid = require('uuid/v5');
var AWS = require('aws-sdk');

const endpoint_url = process.env['AUTH_ENDPOINT_URL'];
const dev_id = process.env['VOICEIT_DEV_ID'];

var responseBody = {
    message: 'Hello back from Lambda!',
};

module.exports.handler = (event, context, callback) => {
    console.log('request body:', event);
    console.log('auth secret key - custom DNS based:', uuid('voiceit.bankassist.com', uuid.DNS));
    try {
        console.log('converting to byteArray...');
        var byteCharacters = atobObj(event.body);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        console.log('byteArray is :', byteArray);
        /** uncomment for REAL authentication using VoiceIt
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
            if (error) {
                console.log('Error response received from VoiceIt');
                returnErrorMessage(error, callback);
            }
            else {
                console.log('Auth response from VoiceIt:' + JSON.stringify(response));
                // TODO generate auth token and send it in auth. success response
                const respified = {
                    statusCode: 200,
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify(response)
                }
                callback(
                    null,
                    respified
                );
            }
        });
        */
        var cognitoIdentity = new AWS.CognitoIdentity();
        // get OpenId Token for Developer Identity
        var openIdToken;
        
        getOpenIdToken(cognitoIdentity, event.headers.userid).then(result => {
            console.log('response from cognitoIdentity:',result);
            openIdToken = result;
            console.log('openIdToken is :', openIdToken);
            const response = {
                "Result": "Authentication successful. 89.0%",
                "Confidence": "89.0", "DetectedVoiceprintText": "This is a bypassed voice authentication",
                "DetectedTextConfidence": "97.567433",
                "EnrollmentID": "449867",
                "ResponseCode": "SUC",
                "TimeTaken": "1.02s",
                "OpenIdToken": openIdToken
            };
            const respified = {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(response)
            }
            callback(
                null,
                respified
            );
        }).catch(err =>{
            console.log('error from cognitoIdentity:',err);
            openIdToken = err;
            console.log('openIdToken is :', openIdToken);
            const response = {
                "Result": "Authentication successful. 89.0%",
                "Confidence": "89.0", "DetectedVoiceprintText": "This is a bypassed voice authentication",
                "DetectedTextConfidence": "97.567433",
                "EnrollmentID": "449867",
                "ResponseCode": "SUC",
                "TimeTaken": "1.02s",
                "OpenIdToken": openIdToken
            };
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
        console.log('Error while invoking VoiceIt authentication API:', err);
        returnErrorMessage(err, callback);
    }

};

/**
 * Function to get the OpenId token for Developer Identity
 * @param {*} cognitoIdentity 
 * @param {*} userId 
 */
function getOpenIdToken(cognitoIdentity, userId){

    var params = {
        IdentityPoolId: 'us-east-1:cee7f82c-aac5-4841-b430-1d695035a0be', /* required */
        Logins: { /* required */
            'login.rayfocus.bankassist': userId,
            /* '<IdentityProviderName>': ... */
        },
        TokenDuration: 15000
    };
    return new Promise((resolve, reject) => {
        cognitoIdentity.getOpenIdTokenForDeveloperIdentity(params, function (err, data) {
            if (err) {               
                reject(err);  // an error occurred
            }
            else {
                resolve(data);          // successful response
            }
        });
    })   
}

function returnErrorMessage(err, callback) {
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
