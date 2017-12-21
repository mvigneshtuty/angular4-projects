import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { InfomessageService } from '../../services/infomessage.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { VoiceitService } from '../../services/voiceit.service';
import { NavbarSvc } from '../../services/navbar.service';
import * as AudioRecorder from 'recorder-js';

import { Authentication } from '../../types/authentication';
import { VoiceItAuthParams } from '../../types/voiceit.auth.params';
import { User } from '../../types/user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-authenticate-user',
  templateUrl: './authenticate-user.component.html',
  styleUrls: ['./authenticate-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthenticateUserComponent implements OnInit {

  userId: string;
  isUserVerified: string;
  user: User;
  recorder: AudioRecorder;
  isRecording: boolean;
  private audioWav: any;
  AUTH_SAMPLES: Authentication[] = [];
  authParams: VoiceItAuthParams;
  isSpinnerLoading: boolean;

  constructor(private router: Router,
    private infoMsgService: InfomessageService,
    private audioRecorderSvc: AudioRecorderService,
    private voiceItSvc: VoiceitService,
    private domSanitizer: DomSanitizer,
    private navbarSvc: NavbarSvc) { }

  ngOnInit() {
    this.voiceItSvc.currentUser.subscribe(val => {
      this.user = val;
      this.userId = val.id;
    });
    this.voiceItSvc.userVerificationStatus.subscribe(val => this.isUserVerified = val);
    this.infoMsgService.clear();
    this.audioRecorderSvc.initUserMedia();
  }

  getRecorderInstance(): AudioRecorder {
    this.audioRecorderSvc.recorderObjObserver.subscribe(obj => this.recorder = obj);
    console.log('Recorder in Authentication Component:', this.recorder);
    return this.recorder;
  }

  startRecording = ()  => {
    this.recorder = this.getRecorderInstance();
    this.recorder && this.recorder.record();
    this.isRecording = true;
  }

  stopRecording = () => {
    this.recorder && this.recorder.stop();
    this.isRecording = false;

    //getting the AudioWAV
    this.recorder && this.recorder.getAudioWAV((wav) => {
      this.setAudioWav = wav;
      var blob = new Blob([this.getAudioWav], {
        type: 'audio/wav'
      });
    //  if (this.getAuthSamples.length >= 3){
    //    this.getAuthSamples.pop();
    //  }
    //  this.getAuthSamples.reverse();
      this.getAuthSamples.push(
        {
          status: 'Pending',
          audioWav: this.getAudioWav,
          wavObjUrl: URL.createObjectURL(blob)
        }
      );
    //  this.getAuthSamples.reverse();
    });
    this.recorder.clear();
  }

  sanitizeResourceUrl(resourceUrl: any): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
  }

  authenticateVoiceSample(auth: Authentication) {
    this.isSpinnerLoading = true;
    if (auth.status === 'Success') {
      this.infoMsgService.replace('Voice sample already used for authentication');
      return;
    }
    this.setAuthParams = {
      userId: this.getUser.id,
      password: this.getUser.password,
      language: 'en-IN',
      audioWav: auth.audioWav
    }
    this.voiceItSvc.authUserVoice(this.getAuthParams, (error, response) => {
      if (error) {
        this.isSpinnerLoading = false;
        auth.status = 'Failed';
        this.infoMsgService.replace(error);
      }
      else {
        this.isSpinnerLoading = false;
        this.publishAuthResult(auth, response);
      }
    })
  }

  publishAuthResult(authObj, authResponse): void {
    if (authResponse.ResponseCode === 'SUC') {
      authObj.status = 'Success';
      authObj.enrollId = authResponse.EnrollmentID;
      this.infoMsgService.replace('Voice authentication successful using phrase "' + authResponse.DetectedVoiceprintText + '"');
      console.log('OpenId Token from Cognito: ',authResponse.OpenIdToken);
      localStorage.setItem('authToken', authResponse.OpenIdToken.Token);
      localStorage.setItem('identityId', authResponse.OpenIdToken.IdentityId);
      this.navbarSvc.isAuthenticated.next(true);
      this.redirectToWelcomePage();
    }
    else {
      authObj.status = 'Failed';
      this.infoMsgService.replace(authResponse.Result);
    }
  }

  redirectToWelcomePage(): void {
    this.router.navigate(['./user/conversation']);
  }

  goToEnrollment(): void {
    this.router.navigate(['./user/enroll']);
  }

  public get getAudioWav() {
    return this.audioWav;
  }

  public set setAudioWav(value) {
    this.audioWav = value;
  }

  public get getAuthSamples() {
    return this.AUTH_SAMPLES;
  }

  public set setAuthSamples(value) {
    this.AUTH_SAMPLES = value;
  }

  public get getAuthParams() {
    return this.authParams;
  }

  public set setAuthParams(value) {
    this.authParams = value;
  }

  public get getUserId() {
    return this.userId;
  }

  public set setUserId(value) {
    this.userId = value;
  }

  public get getUser() {
    return this.user;
  }

  public set setUser(value) {
    this.user = value;
  }

  public get getInfoMsgService() {
    return this.infoMsgService;
  }
}
