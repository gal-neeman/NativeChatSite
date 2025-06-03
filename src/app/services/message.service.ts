import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message.model";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { MessageDto } from "../models/messageDto.model";
import { MessageResponse } from "../models/messageResponse.model";
import moment from "moment-timezone";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    private readonly http = inject(HttpClient);

    public async getChatMessages(botId: string) : Promise<Message[]> {
        const messages$ = this.http.get<Message[]>(`${environment.messagesUrl}${botId}`);
        let messages = await firstValueFrom(messages$);

        return messages;
    }

    public async sendMessage(message: MessageDto) : Promise<MessageResponse> {
        const message$ = this.http.post<MessageResponse>(`${environment.messagesUrl}`, message);
        const responseMessage = await firstValueFrom(message$);

        console.log(responseMessage);

        // Fix date format
        responseMessage.receivedMessage.createdAt = moment.tz(responseMessage.receivedMessage.createdAt, "Asia/Jerusalem").toDate();
        responseMessage.responseMessage.createdAt = moment.tz(responseMessage.responseMessage.createdAt, "Asia/Jerusalem").toDate();

        return responseMessage;
    }
}