import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlaybackService } from './playback.service';
import { Injectable } from '@angular/core';
import { PlaybackState, PlaybackStatus } from '../models/playback-state.model';
import { Track } from '../models/track.model';
import * as mm from 'music-metadata';
import * as util from 'util';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playbackSub: Subscription;
  private shuffleMode: string;
  private repeatMode: string;
  private index: number = 0;

  private data: Array<Track> = [
    new Track({
      path: 'X:\\Music\\AllttA - The Upper Hand\\01 - AllttA (feat. 20syl & Mr. J. Medeiros).mp3',
      trackId: 1,
      trackName: "AllttA (feat. 20syl & Mr. J. Medeiros)",
      artistId: 1,
      artistName: "AllttA",
      albumId: 1,
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
    // this.playback.load(this.data[0]);
    if (this.data.length > 1) {
      this.index = (this.index >= this.data.length - 1) ? 0 : this.index + 1;
    }
    // consult shuffle and repeat settings, then call playback.load()
    // if the pause between tracks is unacceptable, preloading is ez
    this.playback.load(this.data[this.index]);
  }

  prevTrack() {
    // this.playback.load(this.data[0]);
    if (this.data.length > 1) {
      this.index = (this.index <= 0) ? this.data.length - 1 : this.index - 1;
    }
    // maintain a history of played tracks,
    // this loads previous state instead of randomiizing in reverse
    this.playback.load(new Track(this.data[this.index]));
  }

  import(path: string) {
    mm.parseFile(path)
      .then(metadata => {
        console.log(`parseFile response...`);
        // console.log(util.inspect(metadata, { showHidden: false, depth: null }));
        const temp = new Track({
          path: path,
          trackId: 1,
          trackName: metadata.common.title,
          artistId: 1,
          artistName: metadata.common.artist,
          albumId: 1,
          albumName: metadata.common.album,
        });
        this.data.push(temp);
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
}
