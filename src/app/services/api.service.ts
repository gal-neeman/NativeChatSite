import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bot } from '../models/bot.model';
import { environment } from '../environments/environment';
import { BotDto } from '../models/botDto.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) 
  { }

  public getUserBots(): Observable<Bot[]> {
    const bots$ = this.httpClient.get<Bot[]>(`${environment.botUrl}`);
    return bots$;
  }

  public deleteUserBot(botId: string) {
    const delete$ = this.httpClient.delete(`${environment.botUrl}${botId}`);
    return delete$;
  }

  addBot(botDto: BotDto) {
    const bot$ = this.httpClient.post<Bot>(`${environment.botUrl}create`, botDto);
    return bot$;
  }
}
