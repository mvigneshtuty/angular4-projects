import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../types/user';
import { VoiceItUser } from '../../types/voiceit.user';
import { VoiceItUserParams } from '../../types/voiceit.user.params';
import { VoiceitService } from '../../services/voiceit.service';
import {InfomessageService} from '../../services/infomessage.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user-react.component.html',
  styleUrls: ['./verify-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VerifyUserComponent implements OnInit {

  @Input() user: User = {
    id: '',
    name: '',
    password: ''
  };
  constructor(private voiceitSvc: VoiceitService, 
    private infoMsgService: InfomessageService,
    private fb: FormBuilder) { }

  voiceitUser: VoiceItUser = new VoiceItUser(
    null, null, null);
  params: VoiceItUserParams;
  verifyUserFormGrp: FormGroup;

  ngOnInit() {
   // this.infoMsgService.clear();
    this.initUser();
    this.verifyUserFormGrp = this.fb.group({
      userid: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z0-9]*')
      ]],
      password: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{5,19}$/)
        ]
      ]
    }
    );
  }

  initUser():void{
    //this.voiceitSvc.userHolder.next(this.user);
    //this.voiceitSvc.isUserVerified.next('false');
  }

  /**
   * Verify whether the user is associated with VoiceIt
   */
  verifyUser(): void{
    console.log('User Id inputted for verification:', this.user.id);
    this.params = {
      userId: this.voiceitUser.userId,
      password: this.voiceitUser.password
    }
    this.infoMsgService.replace('Verifying the userId..Please wait..');
   this.voiceitSvc.getVoiceItUser(this.params);
  }

  /** 
   * Reset the form elements
   * 
  */
  reset(): void{
    this.verifyUserFormGrp.reset();
  }

  public get getUserId() {
    return this.verifyUserFormGrp.get('userid');
  }

  public get getPassword() {
    return this.verifyUserFormGrp.get('password');
  }
}
