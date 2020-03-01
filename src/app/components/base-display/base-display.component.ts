import { PlaybackState } from './../../models/playback-state.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'CCDisplay',
  template: '<div class="base-display">{{ text }}</div>',
  styleUrls: ['./base-display.component.css']
})
export class BaseDisplayComponent implements OnChanges, OnDestroy {
  text: string;
  @Input() field: string;
  sub: Subscription;

  constructor(private playback: PlaybackService) { }

  ngOnChanges(): void {
    this.sub?.unsubscribe();
    switch (this.field) {
      case "artist":
        this.sub = this.playback.playback$.subscribe((state: PlaybackState) => {
          this.text = state.track.artistName;
        });
        break;
      case "album":
        this.sub = this.playback.playback$.subscribe((state: PlaybackState) => {
          this.text = state.track.albumName;
        });
        break;
      case "title":
        this.sub = this.playback.playback$.subscribe((state: PlaybackState) => {
          this.text = state.track.trackName;
        });
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
