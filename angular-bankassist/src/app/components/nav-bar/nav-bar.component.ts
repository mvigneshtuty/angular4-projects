import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VoiceitService } from '../../services/voiceit.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {

  userId: string;
  isUserVerified: string;

  constructor(private voiceItService: VoiceitService) { }

  ngOnInit() {
    this.voiceItService.currentUser.subscribe(val => this.userId = val.id);
    this.voiceItService.userVerificationStatus.subscribe(val => this.isUserVerified = val);
  }
 
}
