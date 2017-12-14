import { Injectable } from '@angular/core';
import * as lexAudioWorkerService from './lex-audio-worker.service';
import { LexAudioWorkerService } from './lex-audio-worker.service';
import * as AudioRecorder from 'lex-recorder-js';

@Injectable()
export class LexAudioRecorderService {
 // lexAudioWorkerSvc: LexAudioWorkerService = new LexAudioWorkerService();
  constructor() { 
  //  this.lexAudioWorkerSvc = new LexAudioWorkerService();
  this.initRecorder();
  }

   audioRecorderObj ;
  config = {
  bufferLen: 4096,
  numChannels: 1,
  mimeType: 'application/octet-stream',
  sampleRate: 0
}
   audio_context;
   audio_stream;
   worker = new Worker('../../assets/scripts/worker.js');

  initRecorder = () =>{
    

    /**
     * The Recorder object. Sets up the onaudioprocess callback and communicates
     * with the web worker to perform audion actions.
     */
    var recorder = (source): any => {

      var recording = false,
        initialized = false,
        currCallback, start, silenceCallback, visualizationCallback;

      // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
      var node = source.context.createScriptProcessor(4096, 1, 1);

      this.worker.onmessage = (message) => {
        var blob = message.data;
        currCallback(blob);
      };

      /*
      this.worker.postMessage = (config) => ({
        command: 'init',
        config: {
          sampleRate: source.context.sampleRate,
        }
      });
      */
      //this.audioRecorderObj.init();
      this.config = {
        bufferLen: 4096,
        numChannels: 1,
        mimeType: 'application/octet-stream',
        sampleRate: source.context.sampleRate
      }
      /**
       * Sets the silence and viz callbacks, resets the silence start time, and sets recording to true.
       * @param {?onSilenceCallback} onSilence - Called when silence is detected.
       * @param {?visualizerCallback} visualizer - Can be used to visualize the captured buffer.
       */
      var record = (onSilence, visualizer) => {
        silenceCallback = onSilence;
        visualizationCallback = visualizer;
        start = Date.now();
        recording = true;
        this.audioRecorderObj.record();
      };

      /**
       * Sets recording to false.
       */
      var stop = () => {
        recording = false;
        this.audioRecorderObj.stop();
      };

      /**
       * Posts "clear" message to the worker.
       */
      var clear = () => {
       // this.worker.postMessage({ command: 'clear' });
        this.audioRecorderObj.clear();
      };

      /**
       * Sets the export callback and posts an "export" message to the worker.
       * @param {onExportComplete} callback - Called when the export is complete.
       */
      var exportWAV = (callback) => {
        currCallback = callback;
        console.log('beginning export...lex recorder JS...');
       /* this.worker.postMessage({
          command: 'export'
        });
        */
        this.audioRecorderObj.getAudioWAV(wav => {
          console.log('got wav...');
          console.log('exported wav is ', wav);
          var audioBlob = new Blob([wav], { type: 'application/octet-stream' });
          callback(audioBlob);
        });
      };

      /**
       * Checks the time domain data to see if the amplitude of the sound waveform is more than
       * 0.01 or less than -0.01. If it is, "noise" has been detected and it resets the start time.
       * If the elapsed time reaches 1.5 seconds the silence callback is called.
       */
      var startSilenceDetection = () => {
        analyser.fftSize = 2048;
        var bufferLength = analyser.fftSize;
        var dataArray = new Uint8Array(bufferLength);

        analyser.getByteTimeDomainData(dataArray);

        if (typeof visualizationCallback === 'function') {
          visualizationCallback(dataArray, bufferLength);
        }

        var curr_value_time = (dataArray[0] / 128) - 1.0;

        if (curr_value_time > 0.01 || curr_value_time < -0.01) {
          start = Date.now();
        }
        var newtime = Date.now();
        var elapsedTime = newtime - start;
        console.log('detecting the silence...');
        if (elapsedTime > 1500) {
          console.log('silence callback...');
          silenceCallback();
        }
      };

      /**
       * The onaudioprocess event handler of the ScriptProcessorNode interface. It is the EventHandler to be 
       * called for the audioprocess event that is dispatched to ScriptProcessorNode node types. 
       * @param {AudioProcessingEvent} audioProcessingEvent - The audio processing event.
       */
      node.onaudioprocess = (audioProcessingEvent) => {
        if (!recording) {

          return;
        }
        /*
        this.worker.postMessage({
          command: 'record',
          buffer: [
            audioProcessingEvent.inputBuffer.getChannelData(0),
          ]
        });
        */
        
        startSilenceDetection();
      };

      
      var analyser = source.context.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;

      source.connect(analyser);
      analyser.connect(node);
      node.connect(source.context.destination);

      return {
        record: record,
        stop: stop,
        clear: clear,
        exportWAV: exportWAV
      };
    };

    /**
     * Audio recorder object. Handles setting up the audio context, 
     * accessing the mike, and creating the Recorder object.
     */
    var audioRecorder = (): any => {
      /**
       * Creates an audio context and calls getUserMedia to request the mic (audio).
       * If the user denies access to the microphone, the returned Promise rejected 
       * with a PermissionDeniedError
       * @returns {Promise} 
       */
      var requestDevice = () => {
        console.log('requesting device..');
        if (typeof this.audio_context === 'undefined') {
          (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
          this.audio_context = new AudioContext();
        }
        console.log('returning result...');
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            // var input = new AudioContext().createMediaStreamSource(stream);
            this.audio_stream = stream;
          }).catch(err => console.log('Uh oh... unable to get stream...', err));
      };

      var createRecorder = () => {
        console.log('num of channels...', this.config.sampleRate);
        this.audioRecorderObj = new AudioRecorder(this.audio_context.createMediaStreamSource(this.audio_stream));
        return recorder(this.audio_context.createMediaStreamSource(this.audio_stream, this.worker));
       // return new AudioRecorder(this.audio_context.createMediaStreamSource(this.audio_stream));
      };

      return {
        requestDevice: requestDevice,
        createRecorder: createRecorder
      };

    }

    return {
      audioRecorder: audioRecorder
    }
  }
  
}
