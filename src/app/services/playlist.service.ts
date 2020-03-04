import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlaybackService } from './playback.service';
import { Injectable } from '@angular/core';
import { PlaybackState, PlaybackStatus } from '../models/playback-state.model';
import { Track } from '../models/track.model';
import * as mm from 'music-metadata';
import * as util from 'util';
const path = require('path');

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playbackSub: Subscription;
  private shuffleMode: string;
  private repeatMode: string;
  private index: number = 0;
  private _dataKey = "playlistService-data-v1";
  private data: Array<Track> = [];

  private trackSource = new BehaviorSubject<Track>(Track.initial());
  track$ = this.trackSource.asObservable();

  //   new Track({
  //     filepath: 'X:\\Music\\AllttA - The Upper Hand\\01 - AllttA (feat. 20syl & Mr. J. Medeiros).mp3',
  //     trackId: 1,
  //     trackName: "AllttA (feat. 20syl & Mr. J. Medeiros)",
  //     artistId: 1,
  //     artistName: "AllttA",
  //     albumId: 1,
  //     albumName: "The Upper Hand",
  //   })
  // ];

  constructor() {
    // only subscribe to Stopped event.
    // this.playbackSub = this.playback.playback$.pipe(
    //   filter((state: PlaybackState) => state.event == "ended")
    // ).subscribe((state: PlaybackState) => {
    //   console.log(`Track ended, triggering next track...`);
    //   this.nextTrack();
    // });
    this.index = 0;
    setTimeout(() => {
      this.load();
      // if (this.data.length > 0) {
      //   this.playback.load(this.data[this.index]);
      // }
      
      // this.publishTrack(this.index);
    },100);
    
    // this.refreshMetadata();
  }

  private load() {
    console.log(`load...`);
    const temp: Array<any> = JSON.parse(localStorage.getItem(this._dataKey));
    const processed: Array<Track> = (temp) ? temp.map(x => Object.assign(Track.initial(), x)) : [];
    this.data = processed;
  }

  private save() {
    console.log(`save...`);
    localStorage.setItem(this._dataKey, JSON.stringify(this.data));
  }

  private publishTrack(index: number) {
    if (this.data.length > index) {
      const track = this.data[index];
      if (track instanceof Track) {
        this.trackSource.next(track);
      } else {
        console.warn(`publishTrack did not load a track at index ${index}`);
      }
    } else {
      console.warn(`publishTrack param out of range: ${index}`);
    }
  }

  shuffle(mode: string) {
    this.shuffleMode = mode;
  }

  repeat(mode: string) {
    this.repeatMode = mode;
  }

  nextTrack() {
    this.index += 1;
    if (this.index > this.data.length - 1) {
      this.index = 0;
    }
    this.publishTrack(this.index);
    // Matt: purpose has changed completely. Now we publish track info to subscribers
    // if (this.data.length > 0) {
    //   this.playback.stop();
    //   // this.playback.load(this.data[0]);
    //   if (this.data.length > 1) {
    //     this.index = (this.index >= this.data.length - 1) ? 0 : this.index + 1;
    //   }
    //   // consult shuffle and repeat settings, then call playback.load()
    //   // if the pause between tracks is unacceptable, preloading is ez
    //   this.playback.load(this.data[this.index]);
    //   this.playback.play();
    // }
  }

  prevTrack() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.data.length - 1;
    }
    this.publishTrack(this.index);
    // Matt: purpose has changed completely. Now we publish track info to subscribers
    // if (this.data.length > 0) {
    //   this.playback.stop();
    //   // this.playback.load(this.data[0]);
    //   if (this.data.length > 1) {
    //     this.index = (this.index <= 0) ? this.data.length - 1 : this.index - 1;
    //   }
    //   // maintain a history of played tracks,
    //   // this loads previous state instead of randomiizing in reverse
    //   this.playback.load(new Track(this.data[this.index]));
    //   this.playback.play();
    // }
  }

  async refreshMetadata() {
    for (let k = 0; k < this.data.length; k++) {
      const metadata = await mm.parseFile(this.data[k].filepath);
      const temp = new Track({
        filepath: this.data[k].filepath,
        trackId: 1,
        trackName: metadata.common.title,
        artistId: 1,
        artistName: metadata.common.artist,
        albumId: 1,
        albumName: metadata.common.album,
        duration: metadata.format.duration * 1000
      });
      this.data[k] = temp;
    }
    this.save();
  }

  async importFile(filepath: string, index: number = -1) {
    console.log(`import file starting.`);
    try {
      const metadata = await mm.parseFile(filepath);
      const temp = new Track({
        filepath: filepath,
        trackId: 1,
        trackName: metadata.common.title,
        artistId: 1,
        artistName: metadata.common.artist,
        albumId: 1,
        albumName: metadata.common.album,
        duration: metadata.format.duration * 1000
      });
      this.data.push(temp);
      this.save();

      if (this.data.length == 1) {
        //   this.playback.load(this.data[this.index]);
        this.publishTrack(0);
      }
    } catch (ex) {
      console.log(`EX: ${JSON.stringify(ex)}`);
    }
    // try {
    //   mm.parseFile(filepath)
    //     .then(metadata => {
    //       console.log(`parseFile response...`);
    //       // console.log(util.inspect(metadata, { showHidden: false, depth: null }));
    //       const temp = new Track({
    //         filepath: filepath,
    //         trackId: 1,
    //         trackName: metadata.common.title,
    //         artistId: 1,
    //         artistName: metadata.common.artist,
    //         albumId: 1,
    //         albumName: metadata.common.album,
    //       });
    //       this.data.push(temp);
    //     }, err => {
    //       console.log(`parseFile reject...`);
    //     })
    //     .catch((err) => {
    //       console.error(err.message);
    //     });
    // } catch (ex) {
    //   console.log(ex);
    // }
  }
}
