import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class NavbarSvc {

  constructor() { }

  isAuthenticated = new BehaviorSubject<boolean>(false);
  //currentUser = this.userHolder.asObservable();

  refreshNavBar(): void{
    
  }

  
}
