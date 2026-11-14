import { ErrorHandler, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { GlobalErrorHandler } from './core/services/global-error-handler';
import { PageTitleStrategy } from './core/services/page-title.strategy';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch((error: unknown) => console.error(error));
