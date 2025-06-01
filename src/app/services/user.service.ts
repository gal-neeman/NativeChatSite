import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { credentials } from '../models/credentials';
import { RegisterDto } from '../models/register.dto';
import { User } from '../models/user.model';
import { UserStore } from '../storage/user.store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userStore = inject(UserStore);
  private readonly router = inject(Router);

  constructor() { 
    const token = localStorage.getItem("token");

    if (!token)
      return;

    const payload: any = jwtDecode<{ user: User }>(token);

    const currTime = Math.floor(Date.now() / 1000);
    if (payload.exp - currTime <= 0) {
      localStorage.removeItem("token");
      return;
    }

    this.userStore.initUser(payload.user);
    this.router.navigateByUrl('/app');
  }

  public logout() : void {
    localStorage.removeItem("token");
    this.userStore.logoutUser();
  }

  public async login(loginData: credentials) : Promise<void> {
    const token$ = this.http.post(environment.loginUrl, loginData, { responseType: 'text' });
    const token = await firstValueFrom(token$);

    const payload = jwtDecode<{ user: User }>(token);
    const user = payload.user;

    this.userStore.initUser(user);

    localStorage.setItem("token", token);
  }

  public async register(registerData: RegisterDto) : Promise<void> {
    const token$ = this.http.post(environment.registerUrl, registerData, { responseType: 'text' });
        const token = await firstValueFrom(token$);
        const payload = jwtDecode<{ user: User }>(token);
        const user = payload.user;

        this.userStore.initUser(user);

        localStorage.setItem("token", token);
  }

  public getUser(): User {
    if (this.userStore.user())
      return this.userStore.user();

    return undefined;
  }
}
