import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { CreateUserValidator } from './createuser.validator';
import { VoiceItUser } from '../../types/voiceit.user';
import { VoiceItUserParams } from '../../types/voiceit.user.params';
import { VoiceitService } from '../../services/voiceit.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent implements OnInit {

  voiceitUser: VoiceItUser = new VoiceItUser(
                              null,null,null);
  createUserFormGrp : FormGroup;
  params: VoiceItUserParams;

  constructor(private fb: FormBuilder, 
    private voiceitSvc: VoiceitService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createUserFormGrp = this.fb.group({
      userid: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('[a-zA-Z0-9]*')
      ]],
      passwordgrp: this.fb.group({
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{5,19}$/)
          ]
        ],
        confpwd: ['',
          [
            Validators.required
          ]
        ]
      },
        { validator: CreateUserValidator.isPasswordMisMatched }
      )
    });
  }

  

  public get getUserId() {
    return this.createUserFormGrp.get('userid');
  }

  public get getPassword() {
    return this.createUserFormGrp.get('passwordgrp').get('password');
  }

  public get getConfPwd() {
    return this.createUserFormGrp.get('passwordgrp').get('confpwd');
  }

public get getPasswordGrp(){
  return this.createUserFormGrp.get('passwordgrp');
}

  createUser(): void{
    console.log(this.voiceitUser.userId);
    console.log(this.voiceitUser.password);
    console.log(this.voiceitUser.confirmPwd);
    this.params = {
      userId: this.voiceitUser.userId,
      password: this.voiceitUser.password
    }
    this.voiceitSvc.createVoiceItUser(this.params);
  }

  goToHome(): void{
    this.router.navigate(['./home']);
  }
}
