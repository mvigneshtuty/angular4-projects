import { AbstractControl, ValidationErrors } from "@angular/forms";


export class CreateUserValidator {
 
    static isPasswordMisMatched(control: AbstractControl): ValidationErrors | null {

        const password = control.get('password').value;
        const confpwd = control.get('confpwd').value;

        /** Mismatch when password is null or undefined */
        if (password == null || password == undefined) {
            return {
                mismatch: true
            };
        }
        /** Mismatch when confirm password is null or undefined */
        if (confpwd == null || confpwd == undefined) {
            return {
                mismatch: true
            };
        }
        /** Mismatch when either password or confirm password have empty string */
        if (!((password as string).length > 0) || !((confpwd as string).length > 0)) {
            return {
                mismatch: true
            };
        }
        /** Mismatch when either password and confirm password are not equal */
        if (password !== confpwd) {
            return {
                mismatch: true
            };
        }
        console.log('returning passwords match!...');
        return null;
    }
}
