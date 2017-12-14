import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { InfomessageService } from '../../services/infomessage.service';
import { AudioRecorderService } from '../../services/audio-recorder.service';
import { VoiceitService } from '../../services/voiceit.service';
import * as AudioRecorder from 'recorder-js';
import { LexAudioService } from '../../services/lex-audio.service';
import { LexChatService } from '../../services/lex/lex-chat.service';

import { User } from '../../types/user'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatBotComponent implements OnInit {
  
 // @ViewChild('visualizer') canvas: ElementRef;
 // @ViewChild('message') message: ElementRef;
  canvas: Element;
  message: Element;
  userId: string;
  user: User;
  isUserVerified: string;

  constructor(private router: Router,
    private infoMsgService: InfomessageService,
    private audioRecorderSvc: AudioRecorderService,
    private voiceItSvc: VoiceitService,
    private lexAudioSvc: LexAudioService,
    private lexChatSvc: LexChatService,
    private rd: Renderer2) { }

  ngOnInit() {
    this.voiceItSvc.currentUser.subscribe(val => {
      this.user = val;
      this.userId = val.id;
    });
    this.voiceItSvc.userVerificationStatus.subscribe(val => this.isUserVerified = val);
  //  this.audioRecorderSvc.initUserMedia();
    
  }

  ngAfterViewInit() {
    var initParams = {
      message: document.getElementById("message"),
      canvas: document.getElementById('visualizer'),
      audiocontrol: document.getElementById('audio-control'),
      loggedInUser:this.user
    }
    this.lexChatSvc.init(initParams);
   // this.input.nativeElement.focus();

  }

  /**
   * Getters and Setters
   */

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
}
