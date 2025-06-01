import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
export class MessagesContainerComponent implements AfterViewChecked {
  @ViewChild('messagesContainer')
  messagesContainer: ElementRef;

  @Input()
  messages: Message[];

  @Input()
  bot: Bot;

  @Input()
  user: User;

  // Scroll to bottom when changing view
  ngAfterViewChecked(): void {
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }

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

  public isFirstFromSender(message: Message) : boolean {
    const index = this.messages.indexOf(message);
    
    if (index > 0) {
      return this.messages[index - 1].senderId == message.senderId;
    }

    return false;
  }
}
