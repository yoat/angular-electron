import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, merge, fromEvent, Subscription } from "rxjs";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PlaybackService } from '../../services/playback.service';
@Component({
  selector: 'PlayButton',
  // templateUrl: './play-button.component.html',
  template: `<span class="btn" #button>▶</span>`,
  styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('button', { static: true }) vcButton: ElementRef;

  name = "Play";
  symbol = "▶";

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
        // console.log(`${this.symbol} ${this.name}`);
        this.playback.play();
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
    this.pbSub.unsubscribe();
  }
}
