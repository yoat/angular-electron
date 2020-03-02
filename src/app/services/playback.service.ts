import { Track } from './../models/track.model';
import { Observable, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaybackState, PlaybackStatus, PlaybackActions } from '../models/playback-state.model';
import * as moment from "moment";
import { takeUntil } from 'rxjs/operators';
import StereoAnalyserNode from 'stereo-analyser-node';
import * as mm from 'music-metadata';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  private audioObj = new Audio();
  
  private loadSub: Subscription;
  private ctx: AudioContext;
  private sourceNode: MediaElementAudioSourceNode;
  private gainNode: GainNode;
  private stereoAnal: StereoAnalyserNode;
  private stereoPan: StereoPannerNode;

  private currentTrack: Track;
  private offset: number;
  private elapsed: number;
  // observable properties
  private timeSource = new BehaviorSubject("0:00");
  time$ = this.timeSource.asObservable();
  private playbackSource = new BehaviorSubject<PlaybackState>(PlaybackState.initial());
  playback$ = this.playbackSource.asObservable();

  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];

  constructor() {
    this.ctx = new AudioContext();

    this.ctx.onstatechange = function () {
      console.log(`State: ${this.state}`);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
    this.sourceNode = this.ctx.createMediaElementSource(this.audioObj);
    this.gainNode = this.ctx.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime)

    // // var analyser = this.ctx.createAnalyser();
    // this.stereoAnal = new StereoAnalyserNode(this.ctx);
    // this.stereoAnal.fftSize = 2048;
    // const arrayL = new Float32Array(this.stereoAnal.fftSize);
    // const arrayR = new Float32Array(this.stereoAnal.fftSize);

    // this.stereoAnal.getFloatFrequencyData(arrayL, arrayR);
   }

  // public methods

  observe(): Observable<PlaybackState> {
    return this.playbackSource.asObservable();
  }
  
  async load(track: Track) {
    this.currentTrack = track;
    // try {
    //   console.log(`going to parseFile...`);
    //   // const metadata = await 
    //   mm.parseFile(track.filepath).then((metadata) => {
    //     const trackDuration = metadata.format.duration * 1000;
    //     console.log(`trackDuration: ${this.formatTime(trackDuration)}`);
    //   });
    //   // const temp = new Track({
    //   //   filepath: filepath,
    //   //   trackId: 1,
    //   //   trackName: metadata.common.title,
    //   //   artistId: 1,
    //   //   artistName: metadata.common.artist,
    //   //   albumId: 1,
    //   //   albumName: metadata.common.album,
    //   //   duration: metadata.format.duration * 1000
    //   // });
      
    // } catch (ex) {
    //   console.log(`err ${ex}`);
    // }

    // setup playback
    try {
      this.loadSub?.unsubscribe();
      this.loadSub = this.streamObservable(track.filepath).subscribe((ev: Event) => {
        // console.log(` update [${ev.type}]`);
        // this.timeSource.next(this.formatTime(ev.timeStamp));
        switch(ev.type) {
          case "timeupdate":
            this.elapsed += (ev.timeStamp - this.offset);
            this.offset = ev.timeStamp;
            this.timeSource.next(this.formatTime(this.elapsed));
            break;
          case "play":
            
            break;
          case "playing":
            this.offset = ev.timeStamp;
            break;
          case "pause":
            break;
          case "canplay":
            this.elapsed = 0;
            console.log(`canplay ????`);
            break;
          case "loadstart":
            console.log(`loadstart >>>>>`);
            break;
          case "loadedmetadata":
            console.log(`metadata loaded.....`);
            break;
          case "ended":
            const status = this.playbackSource.value;
            status.event = "ended";
            status.status = PlaybackStatus.Stopped;
            this.playbackSource.next(status);
            break;
          case "error":
            console.error(`Error: ${JSON.stringify(ev)}`)
            break;
          default:
            console.warn(`Unknown state type: ${ev.type}`);
            break;
        }
      });
      
    } catch (ex) {

    }

    // distribute notifications
    try {
      const state = new PlaybackState(PlaybackStatus.NotPlaying, "", track);
      this.playbackSource.next(state);
      this.timeSource.next("0:00");
    } catch (ex) {

    }
  }

  play() {
    if (this.playbackSource.value.status == PlaybackStatus.Playing) {
      return;
    } else {
      this.audioObj.play();
    }

    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Playing;
    this.playbackSource.next(modified);
  }

  pause() {
    this.audioObj.pause();

    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Paused;
    this.playbackSource.next(modified);
  }

  stop() {
    this.audioObj.pause();
    this.audioObj.currentTime = 0;

    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Stopped;
    this.playbackSource.next(modified);
  }

  private streamObservable(url): Observable<Event> {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      // this.audioObj.play();

      const handler = (event: Event) => {
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    return (isNaN(time)) ? "0:00" : moment.utc(time).format(format);
  }

  setVolume(unit: number) {
    // must be 0:1
    this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, unit)), this.ctx.currentTime);
  }
}
