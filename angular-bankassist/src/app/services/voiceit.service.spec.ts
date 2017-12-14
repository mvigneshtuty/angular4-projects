import { TestBed, inject } from '@angular/core/testing';

import { VoiceitService } from './voiceit.service';

describe('VoiceitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoiceitService]
    });
  });

  it('should be created', inject([VoiceitService], (service: VoiceitService) => {
    expect(service).toBeTruthy();
  }));
});
