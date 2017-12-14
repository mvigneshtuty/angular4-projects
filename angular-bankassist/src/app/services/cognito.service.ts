import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

import * as AWS from "aws-sdk/global";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";

@Injectable()
export class CognitoService {

  public cognitoCreds: AWS.CognitoIdentityCredentials;
  public static _IDENTITY_POOL_ID = environment.identityPoolId;
  public static _REGION = environment.region;

  constructor() { }

  getCognitoCreds(): AWS.CognitoIdentityCredentials{
   // this.initRegion();
    let params = {
      IdentityPoolId: CognitoService._IDENTITY_POOL_ID /* required */
    };
    let creds = new AWS.CognitoIdentityCredentials(params);
    return creds;
  }

  initRegion():void{
    AWS.config.region = CognitoService._REGION;
  }
}
