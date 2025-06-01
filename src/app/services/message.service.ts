import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message.model";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { MessageDto } from "../models/messageDto.model";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    private readonly http = inject(HttpClient);

    public async getChatMessages(botId: string) : Promise<Message[]> {
        const messages$ = this.http.get<Message[]>(`${environment.messagesUrl}${botId}`);
        const messages = await firstValueFrom(messages$);

        return messages;
    }

    public async sendMessage(message: MessageDto) : Promise<Message> {
        const message$ = this.http.post<Message>(`${environment.messagesUrl}`, message);
        const responseMessage = await firstValueFrom(message$);

        return responseMessage;
    }
}