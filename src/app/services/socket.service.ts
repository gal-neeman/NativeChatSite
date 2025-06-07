import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { EventData } from '../models/eventData.model';
import { filter, map, shareReplay } from 'rxjs';
import { MessageResponse } from '../models/messageResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly url = "wss://localhost:7152/api/v1/ws?token=" + localStorage.getItem("token");
  private socket$: WebSocketSubject<EventData<any>>;

  public emit(eventData: EventData<any>) {
    this.socket$.next(eventData);
  }

  events$ = this.initSocket().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  messages$ = this.events$.pipe(
    filter(e => (e as EventData<MessageResponse>).eventName == 'message'),
    map(e => (e as EventData<MessageResponse>).data as MessageResponse)
  )

  private initSocket() {
    this.socket$ = webSocket<EventData<any>>({
      url: this.url,
      deserializer: msg => JSON.parse(msg.data),
      serializer: value => JSON.stringify(value),
    });

    return this.socket$;
  }
}
