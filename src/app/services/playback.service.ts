import { Track } from './../models/track.model';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlaybackState, PlaybackStatus, PlaybackActions } from '../models/playback-state.model';
import * as moment from "moment";
import { takeUntil } from 'rxjs/operators';
import StereoAnalyserNode from 'stereo-analyser-node';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  private audioObj = new Audio();
  private localFile = 'X:\\Music\\AllttA - The Upper Hand\\01 - AllttA (feat. 20syl & Mr. J. Medeiros).mp3';
  //"file:///X:/Music/AllttA%20-%20The%20Upper%20Hand/01%20-%20AllttA%20(feat.%2020syl%20&%20Mr.%20J.%20Medeiros).mp3";
  private remoteFile = "https://transom.org/wp-content/uploads/2004/03/stereo_96kbps.mp3";
  private stop$ = new Subject();

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

  constructor() { }

  // public methods

  observe(): Observable<PlaybackState> {
    return this.playbackSource.asObservable();
  }
  
  load(track: Track) {
    // setup playback
    try {
    // this.playStream(this.remoteFile).subscribe();

    var audioCtx = new AudioContext();
    // var analyser = audioCtx.createAnalyser();
    const analyser = new StereoAnalyserNode(audioCtx);
    analyser.fftSize = 2048;
    const arrayL = new Float32Array(analyser.fftSize);
    const arrayR = new Float32Array(analyser.fftSize);

    analyser.getFloatFrequencyData(arrayL, arrayR);
    } catch (ex) {

    }

    // distribute notifications
    try {
      const state = new PlaybackState(PlaybackStatus.NotPlaying, track);
      this.playbackSource.next(state);
      this.timeSource.next("0:00");
    } catch (ex) {

    }
  }

  play() {
    if (this.playbackSource.value.status == PlaybackStatus.Playing) {
      return;
    } else if (this.playbackSource.value.status == PlaybackStatus.Paused) {
      this.audioObj.play();
    } else {
      this.playStream(this.localFile).subscribe();
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
    this.stop$.next();

    const modified = this.playbackSource.value;
    modified.status = PlaybackStatus.Stopped;
    this.playbackSource.next(modified);
  }

  doAction(action: PlaybackActions) {
    switch(+action) {
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

  do(event: string) {
    switch (event.toLowerCase()) {
      case "pause":
        this.pause();
        break;
      case "play":
        this.play();
        break;
      case "stop":
        this.stop();
        break;
      default:
        break;
    }
  }

  private streamObservable(url): Observable<any> {
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

  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }
}
