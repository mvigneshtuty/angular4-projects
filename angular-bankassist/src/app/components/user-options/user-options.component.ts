import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VoiceitService } from '../../services/voiceit.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserOptionsComponent implements OnInit {

  userId : string;
  isUserVerified : string;

  constructor(private voiceItService: VoiceitService ) { }

  ngOnInit() {
    this.voiceItService.currentUser.subscribe(val => this.userId = val.id);
    this.voiceItService.userVerificationStatus.subscribe(val => this.isUserVerified = val);
  }

}
