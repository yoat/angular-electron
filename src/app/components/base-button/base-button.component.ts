import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, merge, fromEvent } from 'rxjs';
import { PlaybackService } from '../../services/playback.service';
import { PlaybackActions, PlaybackStatus } from '../../models/playback-state.model';

@Component({
  selector: 'CCButton',
  template: `<span class="btn" #button [matTooltip]="name">{{ symbol }}</span>`,
  styleUrls: ['./base-button.component.css']
})
export class BaseButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('button', { static: true }) vcButton: ElementRef;
  @Input() name: string;
  @Input() symbol: string;
  @Input() action: PlaybackActions;

  inputSub: Subscription;
  pbSub: Subscription;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.pbSub = this.playback.observe().subscribe(() => {
      // toggle between play and pause?
    });
  }

  ngAfterViewInit() {
    this.inputSub = merge(
      fromEvent(this.vcButton.nativeElement, 'keyup'),
      fromEvent(this.vcButton.nativeElement, 'click'),
    ).pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        console.log(`${this.symbol} ${this.name}`);
        // this.playback.play();
        this.playback.do(this.action);
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
    this.pbSub.unsubscribe();
  }
}
