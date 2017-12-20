import { TestBed, inject } from '@angular/core/testing';

import { NavbarSvc } from './navbar.service';

describe('NavbarSvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavbarSvc]
    });
  });

  it('should be created', inject([NavbarSvc], (service: NavbarSvc) => {
    expect(service).toBeTruthy();
  }));
});
