import { Track } from "./track.model";

export enum PlaybackStatus {
  NotPlaying = 0,
  Stopped = 1,
  Paused,
  Playing,
  Seeking,
  Buffering,
  Loading
}

export enum PlaybackActions {
  Stop = 0,
  Pause = 1,
  Play = 2
}

export class PlaybackState {
  status: PlaybackStatus;
  track: Track;

  constructor(status: PlaybackStatus, track: Track) {
    this.status = status;
    this.track = track;
  }

  get symbol(): string {
    switch(this.status) {
      case PlaybackStatus.Playing:
        return "▶";
      case PlaybackStatus.Paused:
        return "⏸";
      case PlaybackStatus.Stopped:
      default:
        return "⏹"; 
    }
  }

  static initial(): PlaybackState {
    return new PlaybackState(PlaybackStatus.NotPlaying, Track.initial())
  }
}
