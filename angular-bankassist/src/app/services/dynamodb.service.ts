import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

import { CognitoService } from './cognito.service';
import { environment } from "../../environments/environment";

@Injectable()
export class DynamodbService {

  public creds: AWS.Credentials;

  constructor(public cognitoService: CognitoService) { 
    //this.creds = cognitoService.getCognitoCreds();
  }

  getAWSCredentials(): AWS.Credentials{
    return this.cognitoService.getCognitoCreds();
  }

  getUserEnrollmentStatus(userId:string) {
    //console.log("DynamoDBService: reading from DDB with creds - " + this.creds);
    var params = {
      TableName: environment.ddbUserEnrollTable,
      IndexName: environment.ddbUserEnrollStatusIndex,
      KeyConditionExpression: "#userId = :userIdParam and enroll_status=:enrlstatus",
      ExpressionAttributeNames: {
        "#userId": "userId"
      },
      ExpressionAttributeValues: {
        ":userIdParam": userId,
        ":enrlstatus": "SUC"
      }
    };

    this.creds = this.getAWSCredentials();
    AWS.config.update({
      credentials: this.creds,
      region: environment.region
    });
    
    var docClient = new DynamoDB.DocumentClient(this.creds);
    docClient.query(params, onQuery);

    function onQuery(err, data) {
      if (err) {
        console.error("DynamoDBService: Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log("DynamoDBService: Query succeeded.");
        data.Items.forEach(function (userEnrollStatus) {
          console.log('userEnrollStatus :', userEnrollStatus);
        });
      }
    }
  }
}
