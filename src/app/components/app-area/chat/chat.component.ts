import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal } from '@angular/core';
import { MessageBoxComponent } from "../message-box/message-box.component";
import { Bot } from '../../../models/bot.model';
import { Message } from '../../../models/message.model';
import { User } from '../../../models/user.model';
import { MessageDto } from '../../../models/messageDto.model';
import { MessagesContainerComponent } from "../../chat-area/messages-container/messages-container.component";
import { v4 as uuidv4 } from 'uuid';
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
  }

  public onMessageSent(messageContent: string) {
    const messageDto = this.getMessageDtoFromContent(messageContent);
    this.chatStore.sendMessage({ botId: this.bot.id, messageDto: messageDto });
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
}
