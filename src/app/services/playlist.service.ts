import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlaybackService } from './playback.service';
import { Injectable } from '@angular/core';
import { PlaybackState, PlaybackStatus } from '../models/playback-state.model';
import { Track } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playbackSub: Subscription;
  private shuffleMode: string;
  private repeatMode: string;

  constructor(private playback: PlaybackService) {
    // only subscribe to Stopped event.
    this.playbackSub = this.playback.playback$.pipe(
      filter((state: PlaybackState) => state.status === PlaybackStatus.Stopped)
    ).subscribe((state: PlaybackState) => {
      // consult shuffle and repeat settings, then call playback.load()
      // if the pause between tracks is unacceptable, preloading is ez
    });
   }

  shuffle(mode: string) {
    this.shuffleMode = mode;
  }

  repeat(mode: string) {
    this.repeatMode = mode;
  }

  nextTrack() {
    this.playback.load(new Track());
  }

  prevTrack() {
    this.playback.load(new Track());
  }

}
