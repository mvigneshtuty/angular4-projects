import { TestBed, inject } from '@angular/core/testing';

import { LexAudioWorkerService } from './lex-audio-worker.service';

describe('LexAudioWorkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexAudioWorkerService]
    });
  });

  it('should be created', inject([LexAudioWorkerService], (service: LexAudioWorkerService) => {
    expect(service).toBeTruthy();
  }));
});
