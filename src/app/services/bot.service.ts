import { inject, Injectable } from "@angular/core";
import { Bot } from "../models/bot.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { firstValueFrom } from "rxjs";
import { BotDto } from "../models/botDto.model";
import { BotStore } from "../storage/bot.store";

@Injectable({
    providedIn: 'root'
})
export class BotService {
    private readonly http = inject(HttpClient);
    private readonly botStore = inject(BotStore);

    public async getUserBots() : Promise<Bot[]> {
        if (this.botStore.bots().length > 0) {
            return this.botStore.bots();
        }

        const bots$ = this.http.get<Bot[]>(`${environment.botUrl}`);
        const bots = await firstValueFrom(bots$);

        this.botStore.initBots(bots);
        return bots;
    }

    public async deleteBot(botId: string) : Promise<void> {
        const delete$ = this.http.delete(`${environment.botUrl}${botId}`);
        await firstValueFrom(delete$);

        this.botStore.deleteBot(botId);
    }

    public async addBot(botDto: BotDto, userId: string) : Promise<Bot> {
        const bot$ = this.http.post<Bot>(`${environment.botUrl}create`, botDto);
        const bot = await firstValueFrom(bot$);

        this.botStore.addBot(bot);
        return bot;
    }
}