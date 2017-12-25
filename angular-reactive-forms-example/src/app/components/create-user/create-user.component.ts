import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { CreateUserValidator } from './createuser.validator';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../services/shared.service';
import { User } from '../../domain/user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent implements OnInit {

  /** Form Group attribute */
  createUserFormGrp: FormGroup;
  /** User domain object */
  newUser: User = new User();
  /** Boolean variable to indicate the user creation status */
  userCreationFailed: boolean;
  /** Boolean variable to indicate the form submission status */
  formSubmitted: boolean;
  /** alert message to display status of user creation */
  alertMessage: string;

  /**
   * Constructor for Create User Component
   * @param fb FormBuilder object reference
   * @param userService UserService object reference
   * @param sharedService SharedService object reference
   */
  constructor(private fb: FormBuilder,
      private userService: UserService,
      private sharedService: SharedService) { }

  /**
   * OnInit method for Create User Component
   */
  ngOnInit() {
    console.log('init method called...');
    // initialize the create-user-formGroup
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
    this.formSubmitted = false;
  }

  /**
   * Method to handle the Create User Form submission
   */
  createUser(): void{
    /** Show the loading spinner since the API call will take few seconds to complete */
    this.sharedService.showLoadingSpinner.next(true);
    this.sharedService.loadingSpinnerMessage.next('Creating User...');
    /** call the user serice to create new user */
    this.userService.createNewUser(this.newUser)
      .subscribe( result => {
        this.sharedService.showLoadingSpinner.next(false); // hide the loading spinner
        this.formSubmitted = true;
        if(result){
          this.userCreationFailed = false;
          this.alertMessage = 'User created Successfully';
        }
        else{
          this.userCreationFailed = true;
          this.alertMessage = 'User creation failed';
        }
      });
  }

  /**
   * Reset method to clear all the 
   * values in Create User Form.
   */
  reset(): void{
    this.createUserFormGrp.reset();
    this.userCreationFailed = false; // reset the boolean value to hide any existing alerts
    this.formSubmitted = false;
  }

  /**
   * Displays the Create User Form to create
   * another new user.
   */
  createAnotherUser(): void{ 
    this.formSubmitted = false;
    this.newUser.clear();
    this.createUserFormGrp.reset();
  }

  /**
   * Gets the User Id
   */
  public get getUserId() {
    return this.createUserFormGrp.get('userid');
  }

  /**
   * Gets the User Password
   */
  public get getPassword() {
    return this.createUserFormGrp.get('passwordgrp').get('password');
  }

  /**
   * Gets the confirm password
   */
  public get getConfPwd() {
    return this.createUserFormGrp.get('passwordgrp').get('confpwd');
  }

  /**
   * Gets the password formGroup
   */
  public get getPasswordGrp(){
    return this.createUserFormGrp.get('passwordgrp');
  }

}
