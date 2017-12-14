import { Injectable } from '@angular/core';
//import * as recorderService from './lex-audio-recorder.service';
import { LexAudioRecorderService } from './lex-audio-recorder.service';
//import { AudioRecorderService } from '../audio-recorder.service';
//import * as AudioRecorder from 'recorder-js';

@Injectable()
export class LexAudioControlService {

  recorder; 
  lexAudioRecorderSvc = new LexAudioRecorderService();

  constructor() 
    {
    this.lexAudioRecorderSvc = new LexAudioRecorderService();
   }

  
    audioControl =  () => {
      /**
       * This callback type is called `onSilenceCallback`.
       *
       * @callback onSilenceCallback
       */

      /**
       * Visualize callback: `visualizerCallback`.
       *
       * @callback visualizerCallback
       * @param {Uint8Array} dataArray
       * @param {number} bufferLength
       */

      /**
       * Clears the previous buffer and starts buffering audio.
       * @param {?onSilenceCallback} onSilence - Called when silence is detected.
       * @param {?visualizerCallback} visualizer - Can be used to visualize the captured buffer.
       */
      var startRecording = (onSilence, visualizer) => {
        console.log('starting the recording...');
        
        this.recorder = this.lexAudioRecorderSvc.initRecorder().audioRecorder().createRecorder();
        this.recorder.record(onSilence, visualizer);
      };

      /**
       * Stops buffering audio.
       */
      var stopRecording =  () => {
        this.recorder.stop();
      };

      /**
       * On export complete callback: `onExportComplete`.
       *
       * @callback onExportComplete
       * @param {Blob} blob The exported audio as a Blob.
       */

      /**
       * Exports the captured audio buffer.
       * @param {onExportComplete} callback - Called when the export is complete.
       */
      var exportWAV =  (callback) => {
        this.recorder.exportWAV(function (blob) {
          callback(blob);
        });
      };

      /**
       * On playback complete callback: `onPlaybackComplete`.
       *
       * @callback onPlaybackComplete
       */

      /**
       * Plays the audio buffer with an HTML5 audio tag. 
       * @param {Uint8Array} buffer - The audio buffer to play.
       * @param {?onPlaybackComplete} callback - Called when audio playback is complete.
       */
      var play =  (buffer, callback) => {
        var myBlob = new Blob([buffer], { type: 'audio/mpeg' });
        var audio = document.createElement('audio');
        var objectUrl = window.URL.createObjectURL(myBlob);
        audio.src = objectUrl;
        audio.addEventListener('ended', function () {
          audio.currentTime = 0;
          if (typeof callback === 'function') {
            callback();
          }
        });
        audio.play();
        this.recorder.clear();
      };

      var supportsAudio =  (callback) => {
        if (navigator.mediaDevices.getUserMedia) {
          //audioRecorder = lexaudio.audioRecorder();
          this.lexAudioRecorderSvc.initRecorder().audioRecorder().requestDevice()
            .then(function (stream) { callback(true); })
            .catch(function (error) { callback(false); });
        } else {
          callback(false);
        }
      };

      return {
        startRecording: startRecording,
        stopRecording: stopRecording,
        exportWAV: exportWAV,
        play:play,
        supportsAudio: supportsAudio
      }

    }
  
}

