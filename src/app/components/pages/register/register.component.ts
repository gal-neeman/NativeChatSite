import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { RegisterDto } from '../../../models/register.dto';
import { UserService } from '../../../services/user.service';
import { strongPassword } from '../../../utilities/validators';

@Component({
  selector: 'app-register',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

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

  public async send(): Promise<void> {
    const registerData : RegisterDto = {
      email: this.registerForm.get('emailControl').value,
      password: this.registerForm.get('passwordControl').value,
      username: this.registerForm.get('usernameControl').value,
      firstName: this.registerForm.get('firstNameControl').value,
      lastName: this.registerForm.get('lastNameControl').value,
    }

    await this.userService.register(registerData);
    this.router.navigateByUrl('/app');
  }
}