import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PrivacyDialogComponent } from './pages/privacy-dialog/privacy-dialog.component';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppComponent,
    
    HttpClientModule   // ✅ Import standalone component here
  ],
  providers: [],
 
})
export class AppModule {
  constructor() {
    GoogleAuth;
  }
}
