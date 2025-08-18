import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Bot } from "../models/bot.model";
import { ApiService } from "../services/api.service";
import { inject } from "@angular/core";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, concatMap, EMPTY, exhaustMap, filter, tap } from "rxjs";
import { BotDto } from "../models/botDto.model";

export type BotState = {
    bots: Bot[] | undefined,
    status: Status,
    error?: string
}

enum StoreStatuses {
    idle = 'idle',
    loading = 'loading',
    loaded = 'loaded',
    error = 'error'
};

type Status = StoreStatuses.idle | StoreStatuses.loading | StoreStatuses.loaded | StoreStatuses.error;

const initialState: BotState = {
    bots: [],
    status: StoreStatuses.idle,
    error: undefined
};

export const BotStore = signalStore(
    { providedIn: "root" },

    // Initial state
    withState(initialState),

    withMethods((store, api = inject(ApiService)) => ({
        clearBots(): void {
            patchState(store, currentState => ({ bots: [] as Bot[] }))
        },

        addBot: rxMethod<BotDto>(src$ =>
            src$.pipe(
                tap(() => patchState(store, { status: StoreStatuses.loading })),
                concatMap(botDto => 
                    api.addBot(botDto).pipe(
                        tap((bot) => patchState(store, {
                            status: StoreStatuses.loaded,
                            bots: [...store.bots(), bot]
                        })),
                        catchError((err) => {
                            patchState(store, {
                                status: StoreStatuses.error,
                                error: err
                            })
                            return EMPTY;
                        })
                    )
                )
            )
        ),

        deleteBot: rxMethod<string>(src$ =>
            src$.pipe(
                tap(() => patchState(store, { status: StoreStatuses.loading })),
                concatMap(id =>
                    api.deleteUserBot(id).pipe(
                        tap(() => patchState(store, {
                            status: StoreStatuses.loaded,
                            bots: store.bots().filter(bot => bot.id !== id)
                        })),
                        catchError((err) => {
                            patchState(store, {
                                status: StoreStatuses.error,
                                error: err
                            })
                            return EMPTY;
                        })
                    )
                )
            )
        ),

        ensureLoaded: rxMethod<void>(source$ => {
            return source$.pipe(
                filter(() => store.status() !== StoreStatuses.loaded),
                tap(() => patchState(store, { status: StoreStatuses.loading, error: undefined })),
                exhaustMap(() => {
                    return api.getUserBots().pipe(
                        tap(bots => {
                            patchState(store, {
                                bots: bots,
                                status: StoreStatuses.loaded
                            })
                        }),
                        catchError(err => {
                            patchState(store, { error: err });
                            return EMPTY;
                        })
                    )
                })
            )
        })
    })),
)