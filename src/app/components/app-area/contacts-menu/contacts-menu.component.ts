import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal, signal } from '@angular/core';
import { BotCardComponent } from "../bot-card/bot-card.component";
import { NewBuddyButtonComponent } from "../new-buddy-button/new-buddy-button.component";
import { Bot } from '../../../models/bot.model';
import { BotDto } from '../../../models/botDto.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { BotStore } from '../../../storage/bot.store';

@Component({
  selector: 'app-contacts-menu',
  imports: [BotCardComponent, NewBuddyButtonComponent],
  templateUrl: './contacts-menu.component.html',
  styleUrl: './contacts-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsMenuComponent implements OnInit {
  private botStore = inject(BotStore);

  public bots: Signal<Bot[]>;

  ngOnInit(): void {
    this.botStore.ensureLoaded();
    this.bots = this.botStore.bots;
  }

  public deleteBot(bot: Bot): void {
    this.botStore.deleteBot(bot.id);
  }

  public addBot(bot: BotDto) : void {
    this.botStore.addBot(bot);
  }
}
