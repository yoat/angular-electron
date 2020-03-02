import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressScrubberComponent } from './progress-scrubber.component';

describe('ProgressScrubberComponent', () => {
  let component: ProgressScrubberComponent;
  let fixture: ComponentFixture<ProgressScrubberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressScrubberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressScrubberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
