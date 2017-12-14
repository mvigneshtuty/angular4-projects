import { TestBed, inject } from '@angular/core/testing';

import { LexAudioControlService } from './lex-audio-control.service';

describe('LexAudioControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexAudioControlService]
    });
  });

  it('should be created', inject([LexAudioControlService], (service: LexAudioControlService) => {
    expect(service).toBeTruthy();
  }));
});
