import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../storage/auth.store';

@Component({
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TitleCasePipe],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  public username = computed(() => "@" + this.authStore.user().username);
  public initials = computed(() => this.username()[1]);

  public logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl("login");
  }
}
