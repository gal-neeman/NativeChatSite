import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { MessageBoxComponent } from "../message-box/message-box.component";
import { Bot } from '../../../models/bot.model';
import { ContactSelectionService } from '../../../services/contactSelection.service';
import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user.model';
import { MessageDto } from '../../../models/messageDto.model';
import { MessagesContainerComponent } from "../../chat-area/messages-container/messages-container.component";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { SocketService } from '../../../services/socket.service';
import { EventData } from '../../../models/eventData.model';
import { tap } from 'rxjs';
import { AuthStore } from '../../../storage/auth.store';

@Component({
  selector: 'app-chat',
  imports: [MessageBoxComponent, MessagesContainerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  public bot: Bot | null = null;
  public chat = signal<Message[]>([]);
  public user: User;

  private tempMessages: Message[] = [];

  private readonly contactSelectionService = inject(ContactSelectionService);
  private readonly messageService = inject(MessageService);
  private readonly socketService = inject(SocketService);
  private readonly authStore = inject(AuthStore);

  constructor() {
    effect(() => {
      this.bot = this.contactSelectionService.getContact();

      if (this.bot) {
        this.handleContactChange();
      }
    })
  }

  public ngOnInit(): void {
    this.user = this.authStore.user();

    this.socketService.messages$
    .pipe(
      tap(m => {
        m.receivedMessage.createdAt = new Date(m.receivedMessage.createdAt);
        m.responseMessage.createdAt = new Date(m.responseMessage.createdAt);
      }),
    )
    .subscribe(m => {
      const tempMessage = this.tempMessages.find(tmpMsg => tmpMsg.createdAt = m.receivedMessage.createdAt);
      if (tempMessage != null) {
        this.tempMessages = this.tempMessages.filter(m => m.id != tempMessage.id);
        this.chat.update(() => this.chat().filter(m => m.id != tempMessage.id));
      }

      this.chat.update(() => [...this.chat(), m.responseMessage]);
      if (m.receivedMessage != null)
        this.chat.update(() => [...this.chat(), m.receivedMessage].sort((a, b) => moment(a.createdAt).isAfter(b.createdAt) ? 1 : -1));
    })
  }

  public async handleContactChange() {
    this.chat.set((await this.messageService.getChatMessages(this.bot.id)));
  }

  public async onMessageSent(messageContent: string) {
    const message: MessageDto = {
      content: messageContent,
      createdAt: new Date(),
      receiverId: this.bot.id,
      senderId: this.user.id
    }

    const tempMessage = this.generateTempMessage(message);
    this.tempMessages.push(tempMessage);

    this.chat.update(() => [...this.chat(), tempMessage]);

    const eventData: EventData<MessageDto> = {
      data: message,
      eventName: 'message'
    };
    this.socketService.emit(eventData);
  }

  private generateTempMessage(message: MessageDto): Message {
    const tempMessage: Message = {
      content: message.content,
      createdAt: new Date(message.createdAt),
      id: uuidv4(),
      receiverId: message.receiverId,
      senderId: message.senderId
    }

    return tempMessage;
  }
}
