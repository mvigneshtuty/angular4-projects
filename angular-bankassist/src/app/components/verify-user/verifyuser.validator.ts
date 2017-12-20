import { AbstractControl, ValidationErrors } from "@angular/forms";


export class VerifyUserValidator{
    static containsSpace(control : AbstractControl) : ValidationErrors | null{
        if ((control.value as string).indexOf(' ') >=0 ) {
            return {
                containsSpace : true
            };
        }
        return null;
    }

    static isPasswordMisMatched(control: AbstractControl): ValidationErrors | null {
        console.log('Password value in validator: ',control.get('password').value);
        console.log('Confirm password value in validator: ', control.get('confpwd').value);
        const password = control.get('password').value;
        const confpwd = control.get('confpwd').value;
        if (password == null || password == undefined){
            console.log('returning mismatch bcoz of null or undefined...');
            return {
                mismatch: true
            };
        }
        if (confpwd == null || confpwd == undefined) {
            console.log('returning mismatch bcoz of null or undefined - confpwd...');
            return {
                mismatch: true
            };
        }
        if (!((password as string).length > 0) || !((confpwd as string).length > 0)){
            console.log('returning mismatch bcoz of empty value...');
            return {                    
                mismatch: true
            };
        }
         
        if (password !== confpwd) {
            console.log('returning mismatch...');
            return {                    
                mismatch: true
            };
        }
        console.log('returning Match!...');
        return null;
    }
        
 }
