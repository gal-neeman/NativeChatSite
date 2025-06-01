import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Bot } from "../models/bot.model";

export type BotState = {
    bots: Bot[];
}

const initialState: BotState = {
    bots: []
};

export const BotStore = signalStore(
    { providedIn: "root" },

    // Initial state
    withState(initialState),

    withMethods(store => ({
        initBots(bots: Bot[]): void {
            patchState(store, currentState => ({ bots }));
        },

        addBot(bot: Bot): void {
            patchState(store, currentState => ({ bots: [...currentState.bots, bot] }))
        },

        deleteBot(botId: string): void {
            patchState(store, currentState => ({ bots: currentState.bots.filter(b => b.id != botId) }))
        },

        clearBots(): void {
            patchState(store, currentState => ({ bots: [] as Bot[] }))
        }
    })),
)