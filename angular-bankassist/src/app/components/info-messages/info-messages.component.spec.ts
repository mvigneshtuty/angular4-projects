import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMessagesComponent } from './info-messages.component';

describe('InfoMessagesComponent', () => {
  let component: InfoMessagesComponent;
  let fixture: ComponentFixture<InfoMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
