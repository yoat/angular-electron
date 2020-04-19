import { StereoAudioData } from './../models/audio-data.model';
import { PlaylistService } from './playlist.service';
import { TimeUpdate, ITimeUpdate } from './../models/time-update.model';
import { Track } from './../models/track.model';
import { Observable, Subject, Subscription, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PlaybackState, PlaybackStatus, PlaybackActions } from '../models/playback-state.model';
import * as moment from "moment";
import { takeUntil } from 'rxjs/operators';
import StereoAnalyserNode from 'stereo-analyser-node';
import * as mm from 'music-metadata';
import { ipcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  
  private audioObj = new Audio();
  
  private loadSub: Subscription;
  private ctx: AudioContext;
  private sourceNode: MediaElementAudioSourceNode;
  private gainNode: GainNode;
  private analMono: AnalyserNode;
  // private analNode: StereoAnalyserNode;
  private stereoPan: StereoPannerNode;

  private currentTrack: Track;
  private offset: number;
  private elapsed: number;
  // observable properties
  private timeSource = new BehaviorSubject<ITimeUpdate>(TimeUpdate.initial());
  time$ = this.timeSource.asObservable();
  private playbackSource = new BehaviorSubject<PlaybackState>(PlaybackState.initial());
  playback$ = this.playbackSource.asObservable();

  // viz
  private bufferLength = 1024;
  private bBuffer: Uint8Array;
  private fBuffer: Float32Array;
  private vizSource = new BehaviorSubject<StereoAudioData>({ left: new Float32Array(), right: new Float32Array()})
  viz$ = this.vizSource.asObservable();

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

  constructor(private playlist: PlaylistService) {
    console.log(`PLAYBACK SERVICE is go!`);
    this.ctx = new AudioContext();

    this.ctx.onstatechange = function () {
      console.log(`State: ${this.state}`);
    }
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
    this.sourceNode = this.ctx.createMediaElementSource(this.audioObj);
    this.gainNode = this.ctx.createGain();
    this.stereoPan = this.ctx.createStereoPanner();
    //this.analNode = new StereoAnalyserNode(this.ctx);
    this.analMono = this.ctx.createAnalyser();
    this.analMono.fftSize = 2048;
    this.bufferLength = this.analMono.frequencyBinCount;
    this.bBuffer = new Uint8Array(this.bufferLength);
    this.fBuffer = new Float32Array(this.analMono.fftSize);
    this.sourceNode.connect(this.stereoPan);
    this.stereoPan.connect(this.gainNode);
    // this.gainNode.connect(this.ctx.destination);
    this.gainNode.connect(this.analMono);
    this.analMono.connect(this.ctx.destination);
    // this.gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime)

    // // var analyser = this.ctx.createAnalyser();
    // this.stereoAnal = new StereoAnalyserNode(this.ctx);
    // this.stereoAnal.fftSize = 2048;
    // const arrayL = new Float32Array(this.stereoAnal.fftSize);
    // const arrayR = new Float32Array(this.stereoAnal.fftSize);

    // this.stereoAnal.getFloatFrequencyData(arrayL, arrayR);

    this.playlist.track$.subscribe((track: Track) => {
      console.log(`track$ event received by playback...`);
      if (track.trackId <= 0) {
        console.log(`placeholder track, do nothing`);
      // } else if (track.trackId === this.currentTrack.trackId) {
      //   console.log(`track already loaded, thanks Playlist!`);
      } else {
        this.load(track);
      }
    });


    ipcRenderer.send('create-window', { name: 'viz', debug: true, show: false });
    ipcRenderer.send('create-window', { name: 'playlist', debug: true, show: false });
  }

  // public methods

  get context(): AudioContext {
    return this.ctx;
  }

  get source(): MediaElementAudioSourceNode {
    return this.sourceNode;
  }

  observe(): Observable<PlaybackState> {
    return this.playbackSource.asObservable();
  }
  
  async load(track: Track) {
    // this.stop();
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
            this.timeSource.next({ 
              current: this.elapsed, 
              duration: this.currentTrack.duration
            });
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
            this.timeSource.next({
              current: 0,
              duration: this.currentTrack.duration
            });
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
      this.timeSource.next(TimeUpdate.initial());
    } catch (ex) {

    }
  }

  get isPlaying(): boolean {
    return this.playbackSource.value.status == PlaybackStatus.Playing;
  }

  play() {
    if (this.isPlaying) {
      return;
    } else {
      this.audioObj.play();
      window.requestAnimationFrame(this.render);
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

  nextTrack() {
    this.playlist.nextTrack();
  }

  prevTrack() {
    this.playlist.nextTrack();
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

  

  setVolume(unit: number) {
    console.log(`setVolume(${unit})`);
    // must be 0:1
    this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, unit)), this.ctx.currentTime);
  }

  setBalance(signedUnit: number) {
    // must be 0:1
    const unit = Math.max(-1, Math.min(1, signedUnit));
    this.stereoPan.pan.setValueAtTime(unit, this.ctx.currentTime);
  }

  render() {
    console.log(`renderMono...`);
    if (this) {
      this.analMono.getFloatFrequencyData(this.fBuffer);
      this.publish(this.fBuffer);

      // this.vizSource.next({ left: arrayL, right: arrayR });
      if (this.isPlaying) {
        window.requestAnimationFrame(this.render.bind(this));
      }
    }

  }

  private publish(buffer: Float32Array) {
    // console.log(`publishing buffer.`);
    // ipcRenderer.send('vizData', {
    //   buffer
    // });
    ipcRenderer.sendToHost('viz-data', { buffer });
  }

  sampleSend() {
    ipcRenderer.invoke("get-id", { name: 'viz' }).then(vizId => {
      console.log(`resp ${JSON.stringify(vizId)}`);
      ipcRenderer.sendTo(vizId, "viz-data", [1, 2, 3, 4]);
    }, err => {
        console.log(`error ${JSON.stringify(err)}`);
    });
  }
  // renderStereo() {
  //   // console.log(`render...`);
  //   const arrayL = new Float32Array(1024);
  //   const arrayR = new Float32Array(1024);

  //   if (this) {
  //     this.analNode.getFloatFrequencyData(arrayL, arrayR);

  //     this.vizSource.next({left: arrayL, right: arrayR});
  //     if (this.isPlaying) {
  //       window.requestAnimationFrame(this.render.bind(this));
  //     }
  //   }
    
  // }
}
