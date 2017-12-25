import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Reactive Forms - Example';
  showLoadingSpinner: boolean;
  loadingSpinnerMessage: string;

  /**
   * Constructor for App Component
   * @param sharedService SharedService object reference
   */
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.showLoadingSpinner.asObservable().subscribe(val => this.showLoadingSpinner = val);
    this.sharedService.loadingSpinnerMessage.asObservable().subscribe(val => this.loadingSpinnerMessage = val);
  }
}
