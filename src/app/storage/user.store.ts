import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { User } from "../models/user.model";

export type UserState = {
    user: User;
}

const initialState: UserState = {
    user: null
};

export const UserStore = signalStore(
    { providedIn: "root" },

    // Initial state
    withState(initialState),

    withMethods(store => ({
        initUser(user: User): void {
            patchState(store, currentState => ({ user }));
        },

        logoutUser(): void {
            patchState(store, currentState => ({ user: null as User }));
        }
    })),
)