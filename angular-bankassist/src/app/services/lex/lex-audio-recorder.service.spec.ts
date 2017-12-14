import { TestBed, inject } from '@angular/core/testing';

import { LexAudioRecorderService } from './lex-audio-recorder.service';

describe('LexAudioRecorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexAudioRecorderService]
    });
  });

  it('should be created', inject([LexAudioRecorderService], (service: LexAudioRecorderService) => {
    expect(service).toBeTruthy();
  }));
});
