import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router'; // Gidugangan og view transitions
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. PrimeNG Services
    ConfirmationService,
    MessageService,

    // 2. Core Angular Providers
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 3. Router with Smooth Transitions
    provideRouter(routes, withViewTransitions()), // Para naay smooth fade in/out inig balhin og page

    // 4. HTTP Client
    provideHttpClient(withInterceptorsFromDi()),

    // 5. Animations
    provideAnimationsAsync(),

    // 6. PrimeNG v18 Configuration (Themed with Aura)
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          // Giusab nato kini aron ikaw ang naay manual control sa Dark Mode puhon
          darkModeSelector: '.app-dark',
          cssLayer: false
        }
      },
      ripple: true // Gi-enable ang ripple effect para sa nindot nga button clicks
    })
  ]
};