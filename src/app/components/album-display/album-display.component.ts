import { PlaybackState } from './../../models/playback-state.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'AlbumDisplay',
  template: `<div class="title-display">{{ text }}</div>`
})
export class AlbumDisplayComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  text: string;
  id: number;
  
  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.sub = this.playback.playback$.subscribe((state: PlaybackState) => {
      this.text = state.track.albumName;
      this.id = state.track.albumId;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
