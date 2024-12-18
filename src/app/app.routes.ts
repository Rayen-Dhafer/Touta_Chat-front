import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ToutaHomeComponent } from './touta-home/touta-home.component';
import { MessagesComponent } from './home-layout/messages/messages.component';
import { AccountComponent } from './home-layout/account/account.component';

export const routes: Routes = [
    {path : "" , component : ToutaHomeComponent},
    {path : "login" , component : LoginComponent},
    {path : "home" , component : ToutaHomeComponent,
        children: [
            {
              path: "",
              component: MessagesComponent
            },
            {
              path: "messages",
              component: MessagesComponent
            },
            {
              path: "account",
              component: AccountComponent
            },
            {path : "**" , component : MessagesComponent},
          ],
    },
];
