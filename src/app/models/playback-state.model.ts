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
  Pause,
  Play
}

export class PlaybackState {
  status: PlaybackStatus;
  title: string;
  time: string;

  constructor() {
    this.status = PlaybackStatus.NotPlaying;
    this.title = "";
    this.time = "";
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
}
