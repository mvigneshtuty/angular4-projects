import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordValidatorDirective } from './validators/password.validator';

import { AppComponent } from './app.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { VerifyUserComponent } from './components/verify-user/verify-user.component';
import { InfoMessagesComponent } from './components/info-messages/info-messages.component';
import { UserOptionsComponent } from './components/user-options/user-options.component';
import { EnrollUserComponent } from './components/enroll-user/enroll-user.component';
import { AuthenticateUserComponent } from './components/authenticate-user/authenticate-user.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SafeUrlPipe } from './utils/safe-url-pipe';

import { DynamodbService } from './services/dynamodb.service';
import {CognitoService} from './services/cognito.service';
import { VoiceitService } from './services/voiceit.service';
import { InfomessageService } from './services/infomessage.service';
import { AudioRecorderService } from './services/audio-recorder.service';
import { LexAudioService } from './services/lex-audio.service';
import { LexAudioRecorderService } from './services/lex/lex-audio-recorder.service';
import { LexAudioControlService } from './services/lex/lex-audio-control.service';
import { LexAudioWorkerService } from './services/lex/lex-audio-worker.service';
import { LexChatService } from './services/lex/lex-chat.service';
import { NavbarSvc } from './services/navbar.service';

import { AppRoutingModule } from './/app-routing.module';
import { ChatBotComponent } from './components/chat-bot/chat-bot.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ReactFormsComponent } from './components/react-forms/react-forms.component';

@NgModule({
  declarations: [
    AppComponent,
    UserInfoComponent,
    VerifyUserComponent,
    InfoMessagesComponent,
    UserOptionsComponent,
    EnrollUserComponent,
    AuthenticateUserComponent,
    NavBarComponent,
    SafeUrlPipe,
    ChatBotComponent,
    CreateUserComponent,
    ReactFormsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [DynamodbService, CognitoService, VoiceitService, 
    InfomessageService, AudioRecorderService, LexAudioService, 
    LexAudioControlService, LexAudioRecorderService, LexAudioWorkerService, 
    LexChatService, NavbarSvc
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
