import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { User } from '../../types/user';
import { VoiceItUserParams } from '../../types/voiceit.user.params';
import { VoiceitService } from '../../services/voiceit.service';
import {InfomessageService} from '../../services/infomessage.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyUserComponent implements OnInit {

  @Input() user: User = {
    id: '',
    name: '',
    password: ''
  };
  
  params: VoiceItUserParams;

  constructor(private voiceitSvc: VoiceitService, private infoMsgService: InfomessageService) { }

  ngOnInit() {
   // this.infoMsgService.clear();
    this.initUser();
  }

  initUser():void{
    this.voiceitSvc.userHolder.next(this.user);
    this.voiceitSvc.isUserVerified.next('false');
  }

  continue():void{
    console.log('User Id inputted for verification:', this.user.id);
    this.params = {
      userId: this.user.id,
      password:this.user.password
    }
    this.infoMsgService.replace('Verifying the userId..Please wait..');
   this.voiceitSvc.getVoiceItUser(this.params);
  }
}
