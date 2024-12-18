import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ToutaHomeComponent } from './touta-home/touta-home.component';
import { AccountComponent } from './home-layout/account/account.component';
import { MessagesComponent } from './home-layout/messages/messages.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ResetComponent } from './home-layout/reset/reset.component';
import { AboutUsComponent } from './home-layout/about-us/about-us.component';
import { ChatIAComponent } from './home-layout/chat-ia/chat-ia.component';
const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToutaHomeComponent,
    AccountComponent,
    MessagesComponent,
    ResetComponent,
    AboutUsComponent,
    ChatIAComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    SocketIoModule.forRoot(config)  

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
