import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { BotCardComponent } from "../bot-card/bot-card.component";
import { NewBuddyButtonComponent } from "../new-buddy-button/new-buddy-button.component";
import { Bot } from '../../../models/bot.model';
import { BotService } from '../../../services/bot.service';
import { UserService } from '../../../services/user.service';
import { BotDto } from '../../../models/botDto.model';

@Component({
  selector: 'app-contacts-menu',
  imports: [BotCardComponent, NewBuddyButtonComponent],
  templateUrl: './contacts-menu.component.html',
  styleUrl: './contacts-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsMenuComponent {
  private botService = inject(BotService);
  private userService = inject(UserService);

  public bots = signal<Bot[]>(undefined);

  async ngOnInit(): Promise<void> {
    this.bots.set(await this.botService.getUserBots());
  }

  public async deleteBot(bot: Bot) : Promise<void> {
    await this.botService.deleteBot(bot.id);
    this.bots.set(this.bots().filter(b => b.id != bot.id));
  }

  public async addBot(bot: BotDto) : Promise<void> {
    const dbBot = await this.botService.addBot(bot, this.userService.getUser().id);
    this.bots.update(current => [...current, dbBot]);
  }
}
