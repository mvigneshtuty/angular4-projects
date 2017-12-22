import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { RouterModule, Routes, Router } from '@angular/router';

import { User } from '../../types/user';
import { VoiceItUser } from '../../types/voiceit.user';
import { VoiceItUserParams } from '../../types/voiceit.user.params';
import { VoiceitService } from '../../services/voiceit.service';
import {InfomessageService} from '../../services/infomessage.service';
import { SharedService } from '../../services/shared.service';

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
    private fb: FormBuilder,
    private router: Router,
    private sharedSvc: SharedService) { }

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
    this.sharedSvc.showLoadingSpinner.next(true);
    this.sharedSvc.loadingSpinnerMessage.next('Verifying User...');
    
    console.log('User Id inputted for verification:', this.user.id);
    this.params = {
      userId: this.voiceitUser.userId,
      password: this.voiceitUser.password
    }
    this.infoMsgService.replace('Verifying the userId..Please wait..');
   this.voiceitSvc.getVoiceItUser(this.params).then(result => {
     this.sharedSvc.showLoadingSpinner.next(false);
     if (result.ResponseCode == 'SUC') {
       this.infoMsgService.replace('User validation success');
       this.setUser = {
         id: this.params.userId,
         name: 'BankAssistUser',
         password: this.params.password,
       };
       this.voiceitSvc.userHolder.next(this.getUser);
       this.voiceitSvc.isUserVerified.next('true');
       this.router.navigate(['./user/authenticate']);
     }
     else {
       this.infoMsgService.replace(result.Result);
     }
   }).catch(err => {
     this.sharedSvc.showLoadingSpinner.next(false);
     this.infoMsgService.replace(err);
   });
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

  /**
   * Get the user object.
   */
  public get getUser() {
    return this.user;
  }

  /**
   * Sets the user object.
   */
  public set setUser(value) {
    this.user = value;
  }
}
