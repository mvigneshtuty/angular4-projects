import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InfomessageService } from '../../services/infomessage.service';

@Component({
  selector: 'app-info-messages',
  templateUrl: './info-messages.component.html',
  styleUrls: ['./info-messages.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfoMessagesComponent implements OnInit {

  constructor(private infoMsgService: InfomessageService ) { }

  ngOnInit() {
  }

}
