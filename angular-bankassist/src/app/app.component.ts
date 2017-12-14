import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { VoiceitService } from './services/voiceit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bank Assist Portal';
  userId: string;
  isUserVerified: string;

  constructor(private voiceItService: VoiceitService) { }

  ngOnInit() {
    this.voiceItService.currentUser.subscribe(val => this.userId = val.id);
    this.voiceItService.userVerificationStatus.subscribe(val => this.isUserVerified = val);
  }
}
