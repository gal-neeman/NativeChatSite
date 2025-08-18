import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { Credentials } from '../../../models/credentials';
import { AuthStore } from '../../../storage/auth.store';
import { AuthStates } from '../../../models/authStates.enum';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatCardModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  public loginForm: FormGroup;

  private navOnLogin = effect(() => {
    if (this.authStore.status() === AuthStates.authenticated) {
      this.router.navigateByUrl("app");
    }
  })

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailControl: new FormControl("", [Validators.required, Validators.minLength(10), Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      passwordControl: new FormControl("", [Validators.required, Validators.minLength(8)])
    })
  }

  public send(): void {
    const loginData: Credentials = {
      email: this.loginForm.get('emailControl').value, password: this.loginForm.get('passwordControl').value
    }

    this.authStore.login(loginData);
  }
}
