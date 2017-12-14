import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactFormsComponent } from './react-forms.component';

describe('ReactFormsComponent', () => {
  let component: ReactFormsComponent;
  let fixture: ComponentFixture<ReactFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
