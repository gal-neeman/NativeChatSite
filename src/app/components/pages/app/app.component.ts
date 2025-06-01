import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContactsMenuComponent } from "../../app-area/contacts-menu/contacts-menu.component";
import { ChatComponent } from "../../app-area/chat/chat.component";
import { UserBadgeComponent } from "../../user-badge/user-badge.component";
import { BotService } from '../../../services/bot.service';
import { Bot } from '../../../models/bot.model';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app',
  imports: [CommonModule, ContactsMenuComponent, ChatComponent, UserBadgeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private botService = inject(BotService);
  
  public bots = signal<Bot[]>(undefined);

  async ngOnInit(): Promise<void> {
    this.bots.set(await this.botService.getUserBots());
  }

}
