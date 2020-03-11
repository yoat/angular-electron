import { PlaybackState } from './../../models/playback-state.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'CCDisplay',
  template: '<marquee class="base-marquee" behavior="scroll" direction="left" scrollamount="5"><div class="base-display noselect nunito">{{ icon }}{{ text }}</div></marquee>',
  // template: '<div class="base-display scroll-left"><p>{{ icon }}{{ text }}</p></div>',
  styleUrls: ['./base-display.component.scss']
})
export class BaseDisplayComponent implements OnChanges, OnDestroy {
  text: string;
  @Input() field: string;
  @Input() icon: string;
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
