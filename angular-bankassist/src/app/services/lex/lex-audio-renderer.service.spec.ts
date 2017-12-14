import { TestBed, inject } from '@angular/core/testing';

import { LexAudioRendererService } from './lex-audio-renderer.service';

describe('LexAudioRendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexAudioRendererService]
    });
  });

  it('should be created', inject([LexAudioRendererService], (service: LexAudioRendererService) => {
    expect(service).toBeTruthy();
  }));
});
