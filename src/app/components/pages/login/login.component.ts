import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { credentials } from '../../../models/credentials';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatCardModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  public loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      emailControl: new FormControl("", [Validators.required, Validators.minLength(10), Validators.pattern("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]),
      passwordControl: new FormControl("", [Validators.required, Validators.minLength(8)])
    })
  }

  public async send() : Promise<void> {
    const loginData : credentials = {
      email: this.loginForm.get('emailControl').value, password: this.loginForm.get('passwordControl').value
    }

    await this.userService.login(loginData);
    this.router.navigateByUrl("app");
  }
}
