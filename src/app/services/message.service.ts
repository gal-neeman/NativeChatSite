import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message.model";
import { firstValueFrom } from "rxjs";
import { MessageDto } from "../models/messageDto.model";
import { MessageResponse } from "../models/messageResponse.model";
import { apiRoutes } from "../utilities/apiRoutes";

@Injectable({
    providedIn: "root"
})
export class MessageService {
    private readonly http = inject(HttpClient);

    public async getChatMessages(botId: string) : Promise<Message[]> {
        const messages$ = this.http.get<Message[]>(`${apiRoutes.messages}${botId}`);
        let messages = await firstValueFrom(messages$);

        messages = messages.map(m => ({
            ...m,
            createdAt: new Date(m.createdAt),
        }))
        return messages;
    }

    public async sendMessage(message: MessageDto) : Promise<MessageResponse> {
        const message$ = this.http.post<MessageResponse>(`${apiRoutes.messages}`, message);
        const responseMessage = await firstValueFrom(message$);

        return responseMessage;
    }
}
