import { Directive } from '@angular/core';
import { NG_VALIDATORS, FormControl, Validator, ValidationErrors } from '@angular/forms';


@Directive({
 selector: '[passwordChecker]',
    providers: [{ provide: NG_VALIDATORS, useExisting: PasswordValidatorDirective, multi: true}]
})
export class PasswordValidatorDirective implements Validator {

 validate(c: FormControl): ValidationErrors {
   /*const numValue = Number(c.value);
   const currentYear = new Date().getFullYear();
   const minYear = currentYear - 85;
   const maxYear = currentY  bbear - 18;
   */
   //const isValid = !isNaN(numValue) && numValue >= minYear && numValue <= maxYear;
  // const message = {
  //   'years': {
  //     'message': 'The year must be a valid number between ' + minYear + ' and ' + maxYear
  //   }
  console.log('password value is Test...');
     return {
         passwordChecker: {
             valid: true
         }
     } 
   }; 
  // return isValid ? null : message;
  
 }
