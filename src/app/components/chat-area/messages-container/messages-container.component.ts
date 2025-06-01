import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { MessageComponent } from "../message/message.component";
import { ChatAgent } from '../../../models/chatAgent.model';
import { Bot } from '../../../models/bot.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-messages-container',
  imports: [MessageComponent],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesContainerComponent {
  @Input()
  messages: Message[];

  @Input()
  bot: Bot;

  @Input()
  user: User;

   public getSenderAgent(message: Message) : ChatAgent {
      if (this.bot.id == message.senderId &&
          this.user.id == message.receiverId
      ) {
        return {id: this.bot.id, name: this.bot.name};
      }
      else if (this.user.id == message.senderId &&
              this.bot.id == message.receiverId
      ) {
        return {id: this.user.id, name: this.user.username};
      }
  
      return null;
    }
}
