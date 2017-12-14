import { TestBed, inject } from '@angular/core/testing';

import { LexChatService } from './lex-chat.service';

describe('LexChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LexChatService]
    });
  });

  it('should be created', inject([LexChatService], (service: LexChatService) => {
    expect(service).toBeTruthy();
  }));
});
