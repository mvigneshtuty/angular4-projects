import { Injectable } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as voiceit from 'VoiceIt';
import * as request from 'request';
import * as http from 'http';
import * as $ from 'jquery';
import * as cryptoJS from 'crypto-js';
import { environment } from "../../environments/environment";
import { VoiceItUserParams } from '../types/voiceit.user.params';
import { VoiceItEnrollParams } from '../types/voiceit.enroll.params';
import { VoiceItAuthParams } from '../types/voiceit.auth.params';
import { InfomessageService } from './infomessage.service';

import { User } from '../types/user';

@Injectable()
export class VoiceitService {

  user:User = {
    id: '',
    name: 'BankAssistUser',
    password: null,
  };
  userHolder = new BehaviorSubject<User>(new User(this.user));
  currentUser = this.userHolder.asObservable();
  isUserVerified = new BehaviorSubject<string>('false');
  userVerificationStatus = this.isUserVerified.asObservable();

  constructor(private infoMsgService: InfomessageService, private router: Router) { }

  /**
   * Get the user detail from VoiceIt API
   * @param params voiceIt userId and password
   */
  getVoiceItUser(params: VoiceItUserParams):void{
    var endpointURL = environment.bankassist_api+'/get-user';
    console.log('getting user..', params.userId);
    fetch(endpointURL, {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'userId': params.userId,
        'password':params.password
      })
    }).then(response => {
      console.log('response untouched', response);
      if (response.status === 200) {
        response.json().then(respified => {
          console.log('JSON response', respified)
          var voiceItResp = JSON.parse(respified.body);
          console.log('ResponseCode', voiceItResp.ResponseCode)
          if (voiceItResp.ResponseCode == 'SUC'){
            this.infoMsgService.replace('User validation success');
            this.setUser = {
              id: params.userId,
              name: 'BankAssistUser',
              password: params.password,
            };
            this.userHolder.next(this.getUser);
            this.isUserVerified.next('true');
            this.router.navigate(['./user/options']);
          }
          else{
            this.infoMsgService.replace(voiceItResp.Result);
          }
        }).catch(err => {
          console.log('Error parsing the respone as JSON.', err);
          this.infoMsgService.replace(err);
        });
      }
      else {
        throw `Invalid response received with status code ${response.status}`;
      }
    }).catch(err => {
      console.log('Error invoking API gateway endpoint.', err);
      this.infoMsgService.replace(err);
    })
  }

  /**
   * Creates new VoiceIt user by calling the VoiceIt API.
   * 
   * @param params VoiceItUserParams containing userId and password
   *               to create new user.
   */
  createVoiceItUser(params: VoiceItUserParams): void {
    var endpointURL = environment.bankassist_api + '/create-user';
    console.log('creating user..', params.userId);
    fetch(endpointURL, {
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'userId': params.userId,
        'password': params.password
      })
    }).then(response => {
      console.log('response untouched', response);
      if (response.status === 200) {
        response.json().then(respified => {
          console.log('JSON response', respified)
         // var voiceItResp = JSON.parse(respified.body);
          var voiceItResp = respified;
          console.log('ResponseCode', voiceItResp.ResponseCode)
          if (voiceItResp.ResponseCode == 'SUC') {
            this.infoMsgService.replace('User creation success');
            
           // this.userHolder.next(this.getUser);
          //  this.isUserVerified.next('true');
            this.router.navigate(['./home']);
          }
          else {
            this.infoMsgService.replace(voiceItResp.Result);
          }
        }).catch(err => {
          console.log('Error parsing the respone as JSON.', err);
          this.infoMsgService.replace(err);
        });
      }
      else {
        throw `Invalid response received with status code ${response.status}`;
      }
    }).catch(err => {
      console.log('Error invoking API gateway endpoint.', err);
      this.infoMsgService.replace(err);
    })
  }

  /**
   * Enroll the user voice sample using Ajax post to VoiceIt API.
   * 
   * @param params VoiceItEnrollParams containing userId,
   *               password, recorder audioWav as blob
   * @param callback callback function to be executed
   */
  enrollUserViaAjax(params: VoiceItEnrollParams, callback: any){
    $.ajax({
      type: 'POST',
      url: environment.bankassist_api +'/enroll-test',
      data: params.audioWav,
      processData: false,
      contentType: false,
      headers: {
        'Accept': 'application/json',
        'userid': params.userId,
        'password': cryptoJS.SHA256(params.password).toString(),
        'language': params.language,
        'audiowav': params.audioWav
      }
    }).done(function (data) {
      console.log('Ajax resp:', data);
    });
  }

  /**
   * Enroll the user voice sample using fetch to VoiceIt API.
   * 
   * @param params VoiceItEnrollParams containing userId,
   *               password, recorder audioWav as blob
   * @param callback callback function to be executed
   */
  enrollUserVoice(params: VoiceItEnrollParams, callback:any): void {
    var endpointURL = environment.bankassist_api + '/enroll-user';
    console.log('enrolling user..', params.userId);
   /* var base64audioBlob;
    var reader = new FileReader();
    reader.readAsDataURL(params.audioWav);
    reader.onloadend = function () {
      base64audioBlob = reader.result;
      console.log('base64audioBlob: ', base64audioBlob);
    } 
    var reqBody = {
      blobData: base64audioBlob
    } */
    this.infoMsgService.replace('Enrolling the voice sample. please wait...');
    fetch(endpointURL, {
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type':'audio/wav',
        'userid': params.userId,
        'password': cryptoJS.SHA256(params.password).toString(),
        'language': params.language,
        'audiowav': params.audioWav      
      }),
      body: params.audioWav
    }).then(response => {
      console.log('response untouched', response);
      if (response.status === 200) {
        response.json().then(respified => {
          var voiceItResp = JSON.parse(respified.body);
          console.log('JSON response: ' , voiceItResp)
            callback(null, voiceItResp);
        }).catch(err => {
          console.log('Error parsing the respone as JSON.', err);
          this.infoMsgService.replace(err);
          callback(err, null);
        });
      }
      else {
       // callback('ERR', response);
        throw `Invalid response received with status code ${response.status}`;
      }
    }).catch(err => {
      console.log('Error occured while performing enrollment.', err);
      this.infoMsgService.replace(err);
      callback(err, null);
    })

    /*
    return new Promise((resolve, reject) => {
      request({
        url: 'https://cors-anywhere.herokuapp.com/https://siv.voiceprintportal.com/sivservice/api/enrollments',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'audio/wav',
          'UserId': params.userId,
          'VsitPassword': cryptoJS.SHA256(params.password).toString(),
          'VsitDeveloperId': '059fc440a5804db086d8f08d31bede92',
          'ContentLanguage': params.language,
          'wav': params.audioWav
        }
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Response BODY: ', body);
          var jsonResponse = JSON.parse(body);
          resolve(jsonResponse);
        }
        else {
          console.log('ERROR: ', error);
          console.log('ERROR CODE: ', response.statusCode);
          reject(body);
        }
      });
    }) 
    */
  }

  /**
   * Authenticates the user using the voice sample. Calls 
   * the VoiceIt API and takes action depending on the response.
   * 
   * @param params VoiceItAuthParams containing userId,
   *               password, recorder audioWav as blob
   * @param callback callback function to be executed
   */
  authUserVoice(params: VoiceItAuthParams, callback: any): void {
    var endpointURL = environment.bankassist_api + '/auth-user';
    console.log('authenticating user..', params.userId);
    this.infoMsgService.replace('Authenticating the user voice. please wait...');
    console.log('user pwd:', cryptoJS.SHA256(params.password).toString());
    fetch(endpointURL, {
      method: 'post',
      mode: 'cors',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'audio/wav',
        'userid': params.userId,
        'password': cryptoJS.SHA256(params.password).toString(),
        'language': params.language,
        'audiowav': params.audioWav
      }),
      body: params.audioWav
    }).then(response => {
      console.log('response untouched', response);
      if (response.status === 200) {
        response.json().then(respified => {
          console.log("respified is ",respified);
         /** uncomment when doing real authentication 
          * 
          var voiceItResp = JSON.parse(respified.body);
         */
          var voiceItResp = respified;
          console.log('JSON response: ', voiceItResp)
          callback(null, voiceItResp);
        }).catch(err => {
          console.log('Error parsing the respone as JSON.', err);
          this.infoMsgService.replace(err);
          callback(err, null);
        });
      }
      else {
        throw `Invalid response received with status code ${response.status}`;
      }
    }).catch(err => {
      console.log('Error occured while performing authentication.', err);
      this.infoMsgService.replace(err);
      callback(err, null);
    })
  }

  /**
   * Test function to perform user enrollment.
   * @param params VoiceItEnrollParams
   * @param callback callback function to be executed
   */
  enrollUserVoiceTest(params: VoiceItEnrollParams, callback: any): void {
    var endpointURL = environment.bankassist_api + '/enroll-user';
    console.log('enrolling user..', params.userId);
    console.log('pwd:', cryptoJS.SHA256(params.password).toString());
    var post_options = {
      host: 'e5mr5drvr7.execute-api.us-east-1.amazonaws.com',
      path: '/dev/enroll-user',
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
        'Accept': 'application/json',
        'userId': params.userId,
        'password': cryptoJS.SHA256(params.password).toString(),
        'language': params.language,
        'audioWav': JSON.stringify(params.audioWav)
      }
    };

    // Set up the request
    var post_req = http.request(post_options, function (res) {
      res.on('data', function (chunk) {
        console.log('Response from VoiceIt: ' + chunk);
        callback(chunk);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
      //context.succeed();
      this.context.done(null);
    });

    try {
      // post the data
      post_req.write(JSON.stringify(params.audioWav));
     // console.log(post_req.body);
      post_req.end();
    } catch (err) {
      callback(err);
    }
    
  }

  /**
   * Get the user object.
   */
  public get getUser() {
    return this.user;
  }

  /**
   * Sets the user object.
   */
  public set setUser(value) {
    this.user = value;
  }
}
