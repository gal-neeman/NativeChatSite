import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { Message } from "../models/message.model";
import { StoreStatuses } from "../models/storeStatuses.enum";
import { computed, effect, inject, untracked } from "@angular/core";
import { ContactSelectionService } from "../services/contactSelection.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, EMPTY, exhaustMap, filter, map, takeWhile, tap } from "rxjs";
import { ApiService } from "../services/api.service";
import { NUM_MESSAGES_LOAD } from "../utilities/constants";

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

  withMethods((store, api = inject(ApiService)) => ({
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
  })),

  withHooks(store => {
    const contactService = inject(ContactSelectionService);

    effect(() => {
      const contact = contactService.getContact();
      if (!!contact) {
        untracked(() => {
          store.loadInitial(contact.id);
        })
      };
    })

    return {};
  })
)