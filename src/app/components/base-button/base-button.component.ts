import { PlaylistService } from './../../services/playlist.service';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, merge, fromEvent } from 'rxjs';
import { PlaybackService } from '../../services/playback.service';

// [matTooltip]="name"
@Component({
  selector: 'CCButton',
  template: `<span class="btn" #button >{{ symbol }}</span>`,
  styleUrls: ['./base-button.component.css']
})
export class BaseButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('button', { static: true }) vcButton: ElementRef;
  @Input() name: string;
  @Input() symbol: string;
  @Input() event: string;

  inputSub: Subscription;
  pbSub: Subscription;

  constructor(private playback: PlaybackService, private playlist: PlaylistService) { }

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
      debounceTime(20),
      distinctUntilChanged(),
      tap(() => {
        console.log(`${this.symbol} ${this.name}`);
        // this.playback.play();
        this.do(this.event);
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
    this.pbSub.unsubscribe();
  }

  do(event: string) {
    switch (event.toLowerCase()) {
      case "pause":
        this.playback.pause();
        break;
      case "play":
        this.playback.play();
        break;
      case "stop":
        this.playback.stop();
        break;
      case "next":
        this.playlist.nextTrack();
        break;
      case "prev":
        this.playlist.prevTrack();
        break;
      default:
        break;
    }
  }
}
