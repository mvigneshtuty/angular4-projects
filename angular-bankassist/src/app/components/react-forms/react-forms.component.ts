import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from './username.validators';

@Component({
  selector: 'app-react-forms',
  templateUrl: './react-forms.component.html',
  styleUrls: ['./react-forms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReactFormsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  createUserForm = new FormGroup({
    username : new FormControl('',[
      Validators.required,
      Validators.minLength(5),
      UsernameValidators.containsSpace,
      Validators.pattern('[a-zA-Z0-9]*')
    ]),
    password: new FormControl('', Validators.required)
  });

  public get getUserName() {
    return this.createUserForm.get('username');
  }

  public get getPassword() {
    return this.createUserForm.get('password');
  }
}


