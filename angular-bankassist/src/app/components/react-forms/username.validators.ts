import { AbstractControl, ValidationErrors } from "@angular/forms";


export class UsernameValidators{
    static containsSpace(control : AbstractControl) : ValidationErrors | null{
        if ((control.value as string).indexOf(' ') >=0 ) {
            return {
                containsSpace : true
            };
        }
        return null;
    }
}