import { ErrorHandler, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './services/global-error-handler';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
}).catch((error: unknown) => console.error(error));
