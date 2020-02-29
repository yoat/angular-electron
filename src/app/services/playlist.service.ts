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

  private data: Array<Track> = [
    new Track({
      path: 'X:\\Music\\AllttA - The Upper Hand\\01 - AllttA (feat. 20syl & Mr. J. Medeiros).mp3',
      trackId: "1",
      trackName: "AllttA (feat. 20syl & Mr. J. Medeiros)",
      artistId: "1",
      artistName: "AllttA",
      albumId: "1",
      albumName: "The Upper Hand",
    })
  ];

  constructor(private playback: PlaybackService) {
    // only subscribe to Stopped event.
    this.playbackSub = this.playback.playback$.pipe(
      filter((state: PlaybackState) => state.status === PlaybackStatus.Stopped)
    ).subscribe((state: PlaybackState) => {
      console.log(`Track ended, triggering next track...`);
      this.nextTrack();
    });
   }

  shuffle(mode: string) {
    this.shuffleMode = mode;
  }

  repeat(mode: string) {
    this.repeatMode = mode;
  }

  nextTrack() {
    // consult shuffle and repeat settings, then call playback.load()
    // if the pause between tracks is unacceptable, preloading is ez
    this.playback.load(this.data[0]);
  }

  prevTrack() {
    // maintain a history of played tracks,
    // this loads previous state instead of randomiizing in reverse
    this.playback.load(new Track(this.data[0]));
  }

}
