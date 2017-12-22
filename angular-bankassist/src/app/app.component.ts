import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { VoiceitService } from './services/voiceit.service';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bank Assist Portal';
  userId: string;
  isUserVerified: string;

  showLoadingSpinner: boolean = true;
  loadingSpinnerMessage: string;

  constructor(private voiceItService: VoiceitService,
        private sharedSvc: SharedService) 
        { }

  ngOnInit() {
    this.voiceItService.currentUser.subscribe(val => this.userId = val.id);
    this.voiceItService.userVerificationStatus.subscribe(val => this.isUserVerified = val);
    this.sharedSvc.showLoadingSpinner.asObservable().subscribe(val => this.showLoadingSpinner = val);
    this.sharedSvc.loadingSpinnerMessage.asObservable().subscribe(val => this.loadingSpinnerMessage = val);
  }

}
