import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { Message } from '../../../models/message.model';
import { ChatAgent } from '../../../models/chatAgent.model';
import { BotBadgeComponent } from "../../app-area/bot-badge/bot-badge.component";

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

  ngOnInit() {
    if (this.sender)
      this.senderName.set(this.sender.name)
  }
}
