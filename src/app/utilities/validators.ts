import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
        if (control.value.length < 8) return { minlength: true };

        const upperCaseRegex: RegExp = /[A-Z]/;
        if (!upperCaseRegex.test(control.value)) return { nouppercase: true };

        const digitRegex: RegExp = /\d/;
        if (!digitRegex.test(control.value)) return { nodigits: true };

        const nonAlphanumeric: RegExp = /[^a-zA-Z0-9]/;
        if (!nonAlphanumeric.test(control.value)) return { nononalphanumeric: true };

        return null;
    };
}