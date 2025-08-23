import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Message } from "../models/message.model";
import { StoreStatuses } from "../models/storeStatuses.enum";
import { computed, effect, inject, untracked } from "@angular/core";
import { ContactSelectionService } from "../services/contactSelection.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, EMPTY, exhaustMap, filter, map, takeWhile, tap } from "rxjs";
import { ApiService } from "../services/api.service";
import { NUM_MESSAGES_LOAD } from "../utilities/constants";
import { MessageDto } from "../models/messageDto.model";
import { EventData } from "../models/eventData.model";
import { SocketService } from "../services/socket.service";

type ConversationState = {
  messages: Message[];
  nextCursor: string;
};

type ChatState = {
  chats: Map<string, ConversationState>,
  status: Status,
  error?: string;
}

type Status = StoreStatuses.idle | StoreStatuses.loading | StoreStatuses.loaded | StoreStatuses.error;

const initialState: ChatState = {
  chats: new Map<string, ConversationState>(), // botId -> ChatState
  status: StoreStatuses.idle,
  error: undefined
};

export const ChatStore = signalStore(
  { providedIn: "root" },

  withState(initialState),

  withComputed((store, contactService = inject(ContactSelectionService)) => ({
    activeChat: computed(() => store.chats().get(contactService.getContact()?.id)?.messages ?? null)
  })),

  withMethods((store, api = inject(ApiService), socket = inject(SocketService)) => ({
    loadInitial: rxMethod<string>(src$ =>
      src$.pipe(
        filter(botId => !store.chats().get(botId) && store.status() !== StoreStatuses.loading),
        tap(() => patchState(store, { status: StoreStatuses.loading, error: undefined })),
        exhaustMap((botId) =>
          api.getMessages(botId, NUM_MESSAGES_LOAD).pipe(
            map((messages) => messages.map(m => ({
              ...m,
              createdAt: new Date(m.createdAt),
            }))),
            tap((messages) => {
              const updated: ConversationState = {
                messages: messages,
                nextCursor: undefined
              };
              const updatedChats = new Map(store.chats());
              updatedChats.set(botId, updated);
              patchState((store), {
                chats: updatedChats,
                status: StoreStatuses.loaded,
              })
            }),
            catchError(err => {
              patchState(store, {
                error: err,
                status: StoreStatuses.error
              })
              return EMPTY;
            })
          )
        )
      )
    ),

    sendMessage: rxMethod<{ botId: string, messageDto: MessageDto }>($src => $src.pipe(
      map((messageData) => {
        const tempMessage = getMessageFromMessageDto(messageData.messageDto);
        const updatedChats = new Map(store.chats());
        const updated: ConversationState = {
          messages: [...store.chats().get(messageData.botId).messages, tempMessage],
          nextCursor: store.chats().get(messageData.botId).nextCursor
        };
        updatedChats.set(messageData.botId, updated);
        patchState((store), {
          chats: updatedChats,
          status: StoreStatuses.loaded,
        })

        const eventData: EventData<MessageDto> = {
          data: messageData.messageDto,
          eventName: 'message'
        };
        return eventData;
      }),
      tap(eventData => {
        socket.emit(eventData);
      })
    ))
  })),

  withHooks(store => {
    const contactService = inject(ContactSelectionService);
    const socketService = inject(SocketService);

    effect(() => {
      const contact = contactService.getContact();
      if (!!contact) {
        untracked(() => {
          store.loadInitial(contact.id);
        })
      };
    })

    const messages$ = socketService.messages$;

    return {
      onInit() {
        messages$.pipe(
          tap(m => {
            const updatedChats = new Map(store.chats());
            const botId = m.responseMessage.senderId;
            const updated: ConversationState = {
              messages: [...store.chats().get(botId).messages, m.responseMessage],
              nextCursor: store.chats().get(botId).nextCursor
            };
            updatedChats.set(botId, updated);
            patchState((store), {
              chats: updatedChats,
            })
          })
        )
          .subscribe()
      }
    };
  })
)

function getMessageFromMessageDto(message: MessageDto): Message {
  const tempMessage: Message = {
    content: message.content,
    createdAt: new Date(message.createdAt),
    id: message.clientId,
    receiverId: message.receiverId,
    senderId: message.senderId,
    clientId: message.clientId
  }

  return tempMessage;
}
