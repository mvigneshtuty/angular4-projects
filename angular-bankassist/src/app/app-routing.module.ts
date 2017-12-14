import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { VerifyUserComponent } from './components/verify-user/verify-user.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { EnrollUserComponent } from './components/enroll-user/enroll-user.component';
import { AuthenticateUserComponent } from './components/authenticate-user/authenticate-user.component';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ReactFormsComponent } from './components/react-forms/react-forms.component';

const routes : Routes = [
  { path: 'home', component: VerifyUserComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'user/verify', redirectTo: '/home', pathMatch: 'full' },
  { path: 'user', redirectTo: '/home', pathMatch: 'full' },
  { path: 'user/options', component: UserOptionsComponent },
  { path: 'user/enroll', component: EnrollUserComponent },
  { path: 'user/authenticate', component: AuthenticateUserComponent },
  { path: 'user/conversation', component: ChatBotComponent },
  { path: 'user/create', component: CreateUserComponent},
  { path: 'user/react', component: ReactFormsComponent}
]

@NgModule({
  exports: [
    RouterModule
  ],
  imports:[
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
