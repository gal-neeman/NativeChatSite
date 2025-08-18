import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { AuthStore } from './storage/auth.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withInterceptors(
      [
        ErrorInterceptor,
        tokenInterceptor
      ]
    )),
    provideAppInitializer(() => inject(AuthStore).initFromStorage())
  ]
};
