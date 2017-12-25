import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  showLoadingSpinner = new BehaviorSubject<boolean>(false); // default value `false`
  loadingSpinnerMessage = new BehaviorSubject<string>('Loading...'); // default value `Loading...`

  constructor() { }

}
