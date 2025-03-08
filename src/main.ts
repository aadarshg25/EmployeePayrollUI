import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAnimationsAsync(),
    MatNativeDateModule
  ]
}).catch(err => console.error(err));