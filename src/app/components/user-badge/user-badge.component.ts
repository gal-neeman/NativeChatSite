import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-badge',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TitleCasePipe],
  templateUrl: './user-badge.component.html',
  styleUrl: './user-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  public username = signal<string>(undefined);
  public initials = computed(() => this.username()[1]);

  ngOnInit(): void {
    this.username.set("@" + this.userService.getUser().username);
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigateByUrl("login");
  }
}
