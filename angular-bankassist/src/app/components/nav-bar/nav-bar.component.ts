import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { VoiceitService } from '../../services/voiceit.service';
import { NavbarSvc } from '../../services/navbar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit, AfterViewInit {

  userId: string;
  isUserVerified: string;
  isAuthenticated:boolean;

  constructor(private router: Router,
    private voiceItService: VoiceitService,
    private navbarSvc: NavbarSvc) { }

  ngOnInit() {
    this.voiceItService.currentUser.subscribe(val => this.userId = val.id);
    this.voiceItService.userVerificationStatus.subscribe(val => this.isUserVerified = val);
    console.log('from localStorage : ', localStorage.getItem('authToken'));
    if(localStorage.getItem('authToken')){
      console.log('Authentcated...');
      this.isAuthenticated = true;
    }
    else{
      console.log('NOT Authentcated...');
      this.navbarSvc.isAuthenticated.asObservable().subscribe(val => {
        
        this.isAuthenticated = val;
      });
    }
  }

  ngAfterViewInit(){
   // logic to be executed after View Init
  }

  logout(): void{
    if(localStorage.getItem('authToken')){
      this.navbarSvc.isAuthenticated.next(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('identityId');
      this.router.navigate(['./home']);
    }
  }

  Login(): void {
  //  if (localStorage.getItem('authToken')) {
      this.navbarSvc.isAuthenticated.next(false);
      localStorage.removeItem('authToken');
      this.router.navigate(['./home']);
  //  }
  }

  signUp(): void{
    this.router.navigate(['./user/create']);
  }
 
}
