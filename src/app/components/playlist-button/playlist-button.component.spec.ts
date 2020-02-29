import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistButtonComponent } from './playlist-button.component';

describe('PlaylistButtonComponent', () => {
  let component: PlaylistButtonComponent;
  let fixture: ComponentFixture<PlaylistButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
