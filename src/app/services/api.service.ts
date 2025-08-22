import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bot } from '../models/bot.model';
import { BotDto } from '../models/botDto.model';
import { Credentials } from '../models/credentials';
import { RegisterDto } from '../models/register.dto';
import { Message } from '../models/message.model';
import { apiRoutes } from '../utilities/apiRoutes';

type queryParameter = {
  key: string,
  value: string | number | boolean
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient
  ) 
  { }

  public getUserBots(): Observable<Bot[]> {
    const bots$ = this.httpClient.get<Bot[]>(`${apiRoutes.bot}`);
    return bots$;
  }

  public deleteUserBot(botId: string) {
    const delete$ = this.httpClient.delete(`${apiRoutes.bot}${botId}`);
    return delete$;
  }

  addBot(botDto: BotDto) {
    const bot$ = this.httpClient.post<Bot>(`${apiRoutes.bot}create`, botDto);
    return bot$;
  }

  login(loginData: Credentials) {
    return this.httpClient.post(apiRoutes.login, loginData, { responseType: 'text' });
  }

  register(registerData: RegisterDto) {
    return this.httpClient.post(apiRoutes.register, registerData, { responseType: 'text' });
  }

  getMessages(botId: string, limit?: number) {
    const url = `${apiRoutes.messages}${botId}`;
    let params = new HttpParams();
    if (!!limit)
      params = new HttpParams().set('limit', limit);

    return this.httpClient.get<Message[]>(url, { params });
  }
}
