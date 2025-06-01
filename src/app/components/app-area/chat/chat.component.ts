import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { MessageBoxComponent } from "../message-box/message-box.component";
import { Bot } from '../../../models/bot.model';
import { ContactSelectionService } from '../../../services/contactSelection.service';
import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';
import { MessageComponent } from '../../chat-area/message/message.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { ChatAgent } from '../../../models/chatAgent.model';
import { MessageDto } from '../../../models/messageDto.model';
import { MessagesContainerComponent } from "../../chat-area/messages-container/messages-container.component";

@Component({
  selector: 'app-chat',
  imports: [MessageBoxComponent, MessagesContainerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit{
  public bot : Bot | null = null;
  public chat = signal<Message[]>([]);
  public user : User;

  private readonly contactSelectionService = inject(ContactSelectionService);
  private readonly messageService = inject(MessageService);
  private readonly userService = inject(UserService);


  constructor() {
    effect(() => {
      this.bot = this.contactSelectionService.getContact();

      if (this.bot) {
        this.handleContactChange();
      }
    })
  }

  public ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  public async handleContactChange() {
    this.chat.set(await this.messageService.getChatMessages(this.bot.id));
  }

  public async onMessageSent(messageContent: string) {
    const message : MessageDto = {
      content: messageContent,
      createdAt: new Date(),
      receiverId: this.bot.id,
      senderId: this.user.id
    }
  
    const dbMessage = await this.messageService.sendMessage(message);
    this.chat.update(() => [...this.chat(), dbMessage])
  }
}
