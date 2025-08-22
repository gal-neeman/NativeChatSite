import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { MessageBoxComponent } from "../message-box/message-box.component";
import { Bot } from '../../../models/bot.model';
import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';
import { MessageDto } from '../../../models/messageDto.model';
import { MessagesContainerComponent } from "../../chat-area/messages-container/messages-container.component";
import { v4 as uuidv4 } from 'uuid';
import { SocketService } from '../../../services/socket.service';
import { EventData } from '../../../models/eventData.model';
import { tap } from 'rxjs';
import { AuthStore } from '../../../storage/auth.store';
import { ChatStore } from '../../../storage/chat.store';
import { ContactSelectionService } from '../../../services/contactSelection.service';

@Component({
  selector: 'app-chat',
  imports: [MessageBoxComponent, MessagesContainerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  public bot: Bot | null = null;
  public user: User;
  public chat: Signal<Message[]>;

  private readonly chatStore = inject(ChatStore);
  private readonly socketService = inject(SocketService);
  private readonly authStore = inject(AuthStore);
  private readonly contactSelectionService = inject(ContactSelectionService);

  constructor() {
    effect(() => {
      this.bot = this.contactSelectionService.getContact();
    })
  }

  public ngOnInit(): void {
    this.user = this.authStore.user();
    this.chat = this.chatStore.activeChat;

    this.socketService.messages$
      .pipe(
        tap(m => {
          m.receivedMessage.createdAt = new Date(m.receivedMessage.createdAt);
          m.responseMessage.createdAt = new Date(m.responseMessage.createdAt);
        }),
        tap(m => {
          // this.chat.update(messages => messages.map(
          //   message => message.clientId === m.receivedMessage.clientId ? m.receivedMessage : message
          // ));
          // this.chat.update(messages => [...messages, m.responseMessage]);
        })
      )
      .subscribe()
  }

  public onMessageSent(messageContent: string) {
    const message = this.getMessageDtoFromContent(messageContent);
    const tempMessage = this.getMessageFromMessageDto(message);
    // this.chat.update(() => [...this.chat(), tempMessage]);

    const eventData: EventData<MessageDto> = {
      data: message,
      eventName: 'message'
    };
    this.socketService.emit(eventData);
  }

  private getMessageDtoFromContent(content: string): MessageDto {
    const message: MessageDto = {
      content: content,
      createdAt: new Date(),
      receiverId: this.bot.id,
      senderId: this.user.id,
      clientId: uuidv4()
    }

    return message;
  }

  private getMessageFromMessageDto(message: MessageDto): Message {
    const tempMessage: Message = {
      content: message.content,
      createdAt: new Date(message.createdAt),
      id: message.clientId,
      receiverId: message.receiverId,
      senderId: message.senderId,
      clientId: message.clientId
    }

    return tempMessage;
  }
}
