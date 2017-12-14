import { Injectable } from '@angular/core';
import * as lexAudioControl from './lex/lex-audio-control.service';
import * as lexAudioRenderService from './lex/lex-audio-renderer.service';
import * as AWS from 'aws-sdk/global';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';

@Injectable()
export class LexAudioService {

  lexAudioCntrlSvc = new lexAudioControl.LexAudioControlService();
  lexAudioRenderSvc = new lexAudioRenderService.LexAudioRendererService();
  constructor() { }

  init(initParams): void {
    console.log('init start...');
    var lexruntime, params,
      message = initParams.message,
      audioControl = this.lexAudioCntrlSvc.audioControl(),
      renderer = this.lexAudioRenderSvc.renderer(initParams.canvas);
    console.log('variables declared...');
    var Conversation = function (messageEl) {
      console.log('conversation var declared...');
      var message, audioInput, audioOutput, currentState;

      this.messageEl = messageEl;

      this.renderer = renderer;

      this.messages = Object.freeze({
        PASSIVE: 'Passive...',
        LISTENING: 'Listening...',
        SENDING: 'Sending...',
        SPEAKING: 'Speaking...'
      });

      this.onSilence = function () {
        audioControl.stopRecording();
        currentState.state.renderer.clearCanvas();
        currentState.advanceConversation();
      };

      this.transition = function (conversation) {
        currentState = conversation;
        var state = currentState.state;
        messageEl.textContent = state.message;
        if (state.message === state.messages.SENDING) {
          currentState.advanceConversation();
        } else if (state.message === state.messages.SPEAKING) {
          currentState.advanceConversation();
        }
      };

      this.advanceConversation = function () {
        currentState.advanceConversation();
      };

      currentState = new Initial(this);
    }

    var Initial = function (state) {
      this.state = state;
      state.message = state.messages.PASSIVE;
      this.advanceConversation = function () {
        state.renderer.prepCanvas();
        audioControl.startRecording(state.onSilence, state.renderer.visualizeAudioBuffer);
        state.transition(new Listening(state));
      }
    };

    var Listening = function (state) {
      this.state = state;
      state.message = state.messages.LISTENING;
      this.advanceConversation = function () {
        audioControl.exportWAV(function (blob) {
          console.log('exported blob:', blob);
          state.audioInput = blob;
          state.transition(new Sending(state));
        });
      }
    };

    var Sending = function (state) {
      this.state = state;
      state.message = state.messages.SENDING;
      this.advanceConversation = function () {
        params.inputStream = state.audioInput;
        lexruntime.postContent(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            state.audioOutput = data;
            state.transition(new Speaking(state));
          }
        });
      }
    };

    var Speaking = function (state) {
      this.state = state;
      state.message = state.messages.SPEAKING;
      this.advanceConversation = function () {
        if (state.audioOutput.contentType === 'audio/mpeg') {
          // if (state.audioOutput.contentType === 'PlainText') {
          audioControl.play(state.audioOutput.audioStream, function () {
            state.renderer.prepCanvas();
            audioControl.startRecording(state.onSilence, state.renderer.visualizeAudioBuffer);
            state.transition(new Listening(state));
          });
        }
        else if (state.audioOutput.dialogState === 'ReadyForFulfillment') {
          state.transition(new Initial(state));
        }
      }
    };

    audioControl.supportsAudio( (supported) => {
      if (supported) {
        var conversation = new Conversation(message);
        message.textContent = conversation.message;
        initParams.audiocontrol.onclick = function () {
          params = {
            botAlias: '$LATEST',
            botName: 'BankAssist',
            contentType: 'audio/x-l16; sample-rate=16000',
            userId: 'BlogPostTesting',
            accept: 'audio/mpeg'
          };
          lexruntime = new LexRuntime({
            region: 'us-east-1',
            credentials: new AWS.Credentials('AKIAJWHRZGKPT3YT3OJQ', '6ZYHGRTjtw/ASuphdAv9QrF0UenGBic2J59Z10WT', null)
          });
          conversation.advanceConversation();
        };
      } else {
        message.textContent = 'Audio capture is not supported.';
      }
    });
  }

  

}
