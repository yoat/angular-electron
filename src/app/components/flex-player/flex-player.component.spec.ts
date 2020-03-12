import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexPlayerComponent } from './flex-player.component';

describe('FlexPlayerComponent', () => {
  let component: FlexPlayerComponent;
  let fixture: ComponentFixture<FlexPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
