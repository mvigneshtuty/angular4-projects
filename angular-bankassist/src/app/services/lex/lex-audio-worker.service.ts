import { Injectable } from '@angular/core';
import * as inlineWorker from 'inline-worker';

@Injectable()
export class LexAudioWorkerService {

  //worker: inlineWorker;
  constructor() { }

  
  workerHelper = () => {
    
    var self = {};
    var worker = new inlineWorker(function() {
      var recLength = 0;
      var SIXTEEN_kHz = 16000;
      var recBuffer = [];
      var sampleRate;

      onmessage = (e) => {
        switch (e.data.command) {
          case 'init':
            init(e.data.config);
            break;
          case 'record':
            record(e.data.buffer);
            break;
          case 'export':
            exportBuffer(e.data.cb);
            break;
          case 'clear':
            clear();
            break;
        }
      }

      var init = (config) => {
        sampleRate = config.sampleRate;
      }

      var record = (inputBuffer) => {
        recBuffer.push(inputBuffer[0]);
        recLength += inputBuffer[0].length;
      }

      var exportBuffer = (callback) => {
        var mergedBuffers = mergeBuffers(recBuffer, recLength);
        // var downsampledBuffer = this.downsampleBuffer(mergedBuffers, this.SIXTEEN_kHz);
        var downsampledBuffer = downsampleBuffer(mergedBuffers);
        var encodedWav = encodeWAV(downsampledBuffer);
        var audioBlob = new Blob([encodedWav], { type: 'application/octet-stream' });
        callback(audioBlob);
      }

      var clear = () => {
        recLength = 0;
        recBuffer = [];
      }

      var downsampleBuffer = (buffer) => {
        if (SIXTEEN_kHz === sampleRate) {
          return buffer;
        }
        var sampleRateRatio = sampleRate / SIXTEEN_kHz;
        var newLength = Math.round(buffer.length / sampleRateRatio);
        var result = new Float32Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
          var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
          var accum = 0,
            count = 0;
          for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
          }
          result[offsetResult] = accum / count;
          offsetResult++;
          offsetBuffer = nextOffsetBuffer;
        }
        return result;
      }

      var mergeBuffers = (bufferArray, recLength) => {
        var result = new Float32Array(recLength);
        var offset = 0;
        for (var i = 0; i < bufferArray.length; i++) {
          result.set(bufferArray[i], offset);
          offset += bufferArray[i].length;
        }
        return result;
      }

      var floatTo16BitPCM = (output, offset, input) => {
        for (var i = 0; i < input.length; i++ , offset += 2) {
          var s = Math.max(-1, Math.min(1, input[i]));
          output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
      }

      var writeString = (view, offset, string) => {
        for (var i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      var encodeWAV = (samples) => {
        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 32 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);
        floatTo16BitPCM(view, 44, samples);

        return view;
      }
    }, self);
    return worker;
  }
  
}
