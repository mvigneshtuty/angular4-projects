import { TestBed, inject } from '@angular/core/testing';

import { LexAudioService } from './lex-audio.service';

describe('LexAudioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexAudioService]
    });
  });

  it('should be created', inject([LexAudioService], (service: LexAudioService) => {
    expect(service).toBeTruthy();
  }));
});
