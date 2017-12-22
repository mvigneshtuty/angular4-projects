import { Component, OnInit, ViewEncapsulation, NgZone, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { InfomessageService } from '../../services/infomessage.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { VoiceitService } from '../../services/voiceit.service';
import { SharedService } from '../../services/shared.service';
import * as AudioRecorder from 'recorder-js';

import {Enrollment} from '../../types/enrollment';
import { VoiceItEnrollParams } from '../../types/voiceit.enroll.params';
import { User } from '../../types/user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-enroll-user',
  templateUrl: './enroll-user.component.html',
  styleUrls: ['./enroll-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EnrollUserComponent implements OnInit{

  userId: string;
  user: User;
  isUserVerified: string;
  recorder: AudioRecorder;
  isRecording: boolean;
  private audioWav: any;
  ENROLL_SAMPLES: Enrollment[] = [];
  enrollParams: VoiceItEnrollParams;

  rafID = null;
  analyserContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  recIndex = 0;

  @ViewChild('analyser') analyser;

  constructor(private router: Router,
      private infoMsgService: InfomessageService,
      private audioRecorderSvc: AudioRecorderService,
      private _ngZone: NgZone,
      private voiceItSvc: VoiceitService,
      private domSanitizer: DomSanitizer,
      private sharedSvc: SharedService ) { }

  ngOnInit() {
    this.voiceItSvc.currentUser.subscribe(val => {
      this.user = val;
      this.userId = val.id;
    });
    this.voiceItSvc.userVerificationStatus.subscribe(val => this.isUserVerified = val);
    this.audioRecorderSvc.initUserMedia();
  }

  getRecorderInstance(): AudioRecorder {
    this.audioRecorderSvc.recorderObjObserver.subscribe(obj => this.recorder = obj);
    console.log('Recorder in Enrollment Component:', this.recorder);
    return this.recorder;
  }

  startRecording = () => {
    this.recorder = this.getRecorderInstance();
    this.recorder && this.recorder.record();
    this.isRecording = true;
  }

  stopRecording = () => {
    this.recorder && this.recorder.stop();
    this.isRecording = false;
 
  //getting the AudioWAV
    this.recorder && this.recorder.getAudioWAV( (wav) => {
      this.setAudioWav = wav;
      var blob = new Blob([this.getAudioWav], {
        type: 'audio/wav'
      });
      this.getEnrollSamples.push(
        {
          enrollId: null,
          status: 'Pending',
          audioWav: this.getAudioWav,
          wavObjUrl: URL.createObjectURL(blob)
        }
      );
    });
    this.recorder.clear();
  }

  sanitizeResourceUrl(resourceUrl: any): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(resourceUrl);
  }

  createDownloadLink() {
    this.recorder && this.recorder.exportWAV( (blob) => {
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    document.getElementById('recordingslist').appendChild(li);
  });
}

  enrollVoiceSample(enroll : Enrollment) {
    this.sharedSvc.showLoadingSpinner.next(true);
    this.sharedSvc.loadingSpinnerMessage.next('Enrolling User...');
    console.log('wav from UI component:',enroll.audioWav);
    if (enroll.status === 'Success'){
      this.infoMsgService.replace('Voice sample already enrolled');
      return;
    }
    this.setEnrollParams = {
      userId: this.getUser.id,
      password: this.getUser.password,
      language: 'en-IN',
      audioWav: enroll.audioWav
    }
    this.voiceItSvc.enrollUserVoice(this.getEnrollParams, (error,response) => {
      this.sharedSvc.showLoadingSpinner.next(false);
      if(error){
        enroll.status = 'Failed';
        this.infoMsgService.replace(error);
      }
      else{
        this.publishEnrollmentResult(enroll, response);
      }
    })
  }

  publishEnrollmentResult(enrollObj, enrollmentResponse): void {
    if (enrollmentResponse.ResponseCode === 'SUC') {
      enrollObj.status = 'Success';
      enrollObj.enrollId =  enrollmentResponse.EnrollmentID;
      this.infoMsgService.replace('Voice sample enrolled successfully for phrase "' + enrollmentResponse.DetectedVoiceprintText + '"');
    }
    else {
      enrollObj.status = 'Failed';
      this.infoMsgService.replace(enrollmentResponse.Result);
    }
  }

  ProceedToAuthentication(): void {
    this.router.navigate(['./user/authenticate']);
  }

  updateAnalysers(): void {
    var audioContext = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    var inputPoint = audioContext.createGain();
    var analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);
    var zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);

    // analyzer draw code here
      var canvasWidth = 100;
      var canvasHeight= 100;
      var SPACING = 3;
      var BAR_WIDTH = 1;
      var numBars = Math.round(canvasWidth / SPACING);
      var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

      analyserNode.getByteFrequencyData(freqByteData);
   var anlyzeContext = this.analyserContext;
    anlyzeContext.clearRect(0, 0, canvasWidth, this.height);
    anlyzeContext.fillStyle = '#F6D565';
    anlyzeContext.lineCap = 'round';
      var multiplier = analyserNode.frequencyBinCount / numBars;

      // Draw rectangle for each frequency bin.
      for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor(i * multiplier);
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j < multiplier; j++)
          magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        var magnitude2 = freqByteData[i * multiplier];
        anlyzeContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
        anlyzeContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
      }

    requestAnimationFrame(() => {
      this.updateAnalysers();
    });
   // this.rafID = window.requestAnimationFrame(this.updateAnalysers(this.analyserContext));
  }

  public get getAudioWav() {
    return this.audioWav;
  }

  public set setAudioWav(value) {
    this.audioWav = value;
  }

  public get getEnrollSamples() {
    return this.ENROLL_SAMPLES;
  }

  public set setEnrollSamples(value) {
    this.ENROLL_SAMPLES = value;
  }

  public get getEnrollParams() {
    return this.enrollParams;
  }

  public set setEnrollParams(value) {
    this.enrollParams = value;
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

  public get getInfoMsgService(){
    return this.infoMsgService;
  }
}
