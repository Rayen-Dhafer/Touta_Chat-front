import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToutaHomeComponent } from './touta-home/touta-home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './home-layout/messages/messages.component';
import { AccountComponent } from './home-layout/account/account.component';
import { ResetComponent } from './home-layout/reset/reset.component';
import { AboutUsComponent } from './home-layout/about-us/about-us.component';
import { ChatIAComponent } from './home-layout/chat-ia/chat-ia.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect to 'home' if no path
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: ToutaHomeComponent,
    children: [
      { path: '', component: MessagesComponent }, // Default child route
      { path: 'messages', component: MessagesComponent },
      { path: 'chatIA', component: ChatIAComponent },
      { path: 'account', component: AccountComponent },
      { path: 'aboutUs', component: AboutUsComponent },
      { path: 'reset', component: ResetComponent },
     ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
