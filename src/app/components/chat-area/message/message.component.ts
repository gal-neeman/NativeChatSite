import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { Message } from '../../../models/message.model';
import { ChatAgent } from '../../../models/chatAgent.model';
import { BotBadgeComponent } from "../../app-area/bot-badge/bot-badge.component";
import moment from 'moment';

@Component({
  selector: 'app-message',
  imports: [BotBadgeComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
  @Input()
  message: Message;

  @Input()
  public sender : ChatAgent;

  @Input()
  public isFirstMessage: boolean;

  public senderName = signal<string | null>(null);
  public formattedTime : string;

  ngOnInit() {
    if (this.sender)
      this.senderName.set(this.sender.name)

    this.formattedTime = moment(this.message.createdAt).utc(true).tz("Asia/Jerusalem").format("HH:mm");
  }
}
