import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { RegisterDto } from '../../../models/register.dto';
import { strongPassword } from '../../../utilities/validators';
import { AuthStore } from '../../../storage/auth.store';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  public registerForm : FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      emailControl: new FormControl("", [Validators.required, Validators.minLength(10), Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      passwordControl: new FormControl("", [Validators.required, strongPassword()]),
      firstNameControl: new FormControl("", [Validators.required, Validators.minLength(3)]),
      lastNameControl: new FormControl("", [Validators.required, Validators.minLength(3)]),
      usernameControl: new FormControl("", [Validators.required, Validators.minLength(3)]),
    })
  }

  public send(): void {
    const registerData : RegisterDto = {
      email: this.registerForm.get('emailControl').value,
      password: this.registerForm.get('passwordControl').value,
      username: this.registerForm.get('usernameControl').value,
      firstName: this.registerForm.get('firstNameControl').value,
      lastName: this.registerForm.get('lastNameControl').value,
    }

    this.authStore.register(registerData);
    this.router.navigateByUrl('/app');
  }
}