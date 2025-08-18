import { ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { ContactsMenuComponent } from "../../app-area/contacts-menu/contacts-menu.component";
import { ChatComponent } from "../../app-area/chat/chat.component";
import { UserBadgeComponent } from "../../user-badge/user-badge.component";
import { Bot } from '../../../models/bot.model';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { BotStore } from '../../../storage/bot.store';

@Component({
  selector: 'app-app',
  imports: [CommonModule, ContactsMenuComponent, ChatComponent, UserBadgeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly botStore = inject(BotStore);

  public bots: Signal<Bot[]>;

  ngOnInit(): void {
    this.botStore.ensureLoaded();
    this.bots = this.botStore.bots;
  }
}
