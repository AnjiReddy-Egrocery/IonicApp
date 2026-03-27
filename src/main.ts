import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes'; // define your routes below
import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      IonicModule.forRoot(),
      IonicStorageModule.forRoot() // ✅ Storage provider globally available
    ),
    provideRouter(routes),
    provideHttpClient(),
    provideIonicAngular()
  ],
}).catch(err => console.error(err));

