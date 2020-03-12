import { PlaybackState } from './../../models/playback-state.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ArtistDisplay',
  template: `<div class="cc-display artist-display">{{ text }}</div>`
})
export class ArtistDisplayComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  text: string;
  id: number;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.sub = this.playback.playback$.subscribe((state: PlaybackState) => {
      this.text = state.track.artistName;
      this.id = state.track.artistId;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}