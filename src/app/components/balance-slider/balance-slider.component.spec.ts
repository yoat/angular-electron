import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSliderComponent } from './balance-slider.component';

describe('BalanceSliderComponent', () => {
  let component: BalanceSliderComponent;
  let fixture: ComponentFixture<BalanceSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
