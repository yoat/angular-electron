import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicBarsComponent } from './basic-bars.component';

describe('BasicBarsComponent', () => {
  let component: BasicBarsComponent;
  let fixture: ComponentFixture<BasicBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
