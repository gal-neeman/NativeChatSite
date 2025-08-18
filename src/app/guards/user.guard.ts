import { inject, Injectable } from "@angular/core";
import { CanActivate, GuardResult, MaybeAsync, Router } from "@angular/router";
import { AuthStore } from "../storage/auth.store";

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  public canActivate(): MaybeAsync<GuardResult> {
    if (!this.authStore.isLoggedIn()) {
      this.router.navigateByUrl("login");
      return false;
    }

    return true;
  }
}