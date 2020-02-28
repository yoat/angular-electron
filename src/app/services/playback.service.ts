import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaybackState, PlaybackStatus, PlaybackActions } from '../models/playback-state.model';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  private playbackSource = new BehaviorSubject<PlaybackState>(new PlaybackState());
  playback$ = this.playbackSource.asObservable();

  constructor() { }

  // public methods

  play() {
    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Playing;
    this.playbackSource.next(modified);
  }

  pause() {
    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Paused;
    this.playbackSource.next(modified);
  }

  stop() {
    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Stopped;
    this.playbackSource.next(modified);
  }

  do(action: PlaybackActions) {
    switch(action) {
      case PlaybackActions.Pause:
        this.pause();
        break;
      case PlaybackActions.Play:
        this.play();
        break;
      case PlaybackActions.Stop:
      default:
        this.stop();
        break;
    }
  }
}
