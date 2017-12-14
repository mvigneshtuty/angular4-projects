import { TestBed, inject } from '@angular/core/testing';

import { InfomessageService } from './infomessage.service';

describe('InfomessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfomessageService]
    });
  });

  it('should be created', inject([InfomessageService], (service: InfomessageService) => {
    expect(service).toBeTruthy();
  }));
});
