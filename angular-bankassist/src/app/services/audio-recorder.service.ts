   import { Injectable } from '@angular/core';
import * as AudioRecorder from 'recorder-js';

import { InfomessageService } from './infomessage.service';

import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AudioRecorderService {

  recorder: AudioRecorder;
  private recorderObj = new BehaviorSubject<AudioRecorder>(this.recorder);
  recorderObjObserver = this.recorderObj.asObservable();

  constructor(private infoMsgService: InfomessageService) { }

  initUserMedia(): void {
    var audioContext = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        var input = audioContext.createMediaStreamSource(stream);

        // Uncomment if you want the audio to feedback directly
        //input.connect(audioContext.destination);

        this.recorder = new AudioRecorder(input);
        console.log('Recorder initialised..',this.recorder);
        this.recorderObj.next(this.recorder);  
      })
      .catch(err => console.log('Uh oh... unable to get stream...', err));
  }  

  getAudioWav():void{

  }

}
