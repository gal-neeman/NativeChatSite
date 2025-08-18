import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { User } from "../models/user.model";
import { AuthStates } from "../models/authStates.enum";
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { ApiService } from "../services/api.service";
import { Credentials } from "../models/credentials";
import { catchError, concatMap, EMPTY, tap } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { RegisterDto } from "../models/register.dto";

type AuthState = {
  user: User | null;
  status: Status;
  error?: string;
};

type Status = AuthStates.anonymous | AuthStates.authenticating | AuthStates.authenticated | AuthStates.error;

enum AuthErrors {
  noToken = "No token exists in local storage",
  tokenExpired = "The token has expired"
}

const initialState: AuthState = {
  user: null,
  status: AuthStates.anonymous,
  error: null
};

export const AuthStore = signalStore(
  { providedIn: "root" },

  // Initial state
  withState(initialState),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.user()),

    isExpired: computed(() => {
      const user = store.user();
      return !!user?.exp && Date.now() / 1000 >= user.exp;
    })
  })),

  withMethods((store, api = inject(ApiService)) => ({
    login: rxMethod<Credentials>(src$ =>
      src$.pipe(
        tap(() => patchState(store, { status: AuthStates.authenticating, error: undefined })),
        concatMap((credentials) =>
          api.login(credentials).pipe(
            tap(token => {
              const payload = jwtDecode<{ user: User }>(token);
              const user = payload.user;
              patchState(store, { user: user, status: AuthStates.authenticated });
              localStorage.setItem("token", token);
            }),
            catchError(err => {
              patchState(store, { error: err, status: AuthStates.error });
              return EMPTY;
            })
          )
        )
      )
    ),

    register: rxMethod<RegisterDto>(src$ =>
      src$.pipe(
        tap(() => patchState(store, { status: AuthStates.authenticating, error: undefined })),
        concatMap(registerDto =>
          api.register(registerDto).pipe(
            tap(token => {
              const payload = jwtDecode<{ user: User }>(token);
              const user = payload.user;
              patchState(store, { user: user, status: AuthStates.authenticated });
              localStorage.setItem("token", token);
            }),
            catchError(err => {
              patchState(store, { error: err, status: AuthStates.error });
              return EMPTY;
            })
          ))
      )
    ),

    logout() {
      patchState(store, { status: AuthStates.anonymous, user: null, error: undefined });
      localStorage.removeItem("token");
    },

    initFromStorage(): void {
      const token = localStorage.getItem("token");

      if (!token) {
        patchState(store, { error: AuthErrors.noToken, status: AuthStates.error, user: null });
        return;
      }

      const payload: any = jwtDecode<{ user: User }>(token);

      const currTime = Math.floor(Date.now() / 1000);
      if (payload.exp - currTime <= 0) {
        patchState(store, { error: AuthErrors.tokenExpired, status: AuthStates.error, user: null });
        localStorage.removeItem("token");
        return;
      }

      patchState(store, { user: payload.user, status: AuthStates.authenticated });
    },
  })),
)