import { TimeUpdate, ITimeUpdate } from './../../models/time-update.model';
import * as moment from "moment";
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

interface ITimeSettings {
  timeRemaining: boolean;
}

@Component({
  selector: 'TimeDisplay',
  template: `<div class="time-display" (click)="toggle()">{{ text }}</div>`,
  styleUrls: ['./time-display.component.css']
})
export class TimeDisplayComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  text: string;
  timeRemaining: boolean;
  time: TimeUpdate;
  private saver: Subscription;
  private saveKey = "cc-timetoggle-v1";

  constructor(private playback: PlaybackService) {
    this.time = TimeUpdate.initial();
   }

  ngOnInit(): void {
    this.load();

    this.sub = this.playback.time$.subscribe((time: TimeUpdate) => {
      this.time = time;
      this.updateDisplay();
      // console.log(`time updated...`);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    return (isNaN(time)) ? "00:00:00" : moment.utc(time).format(format);
  }

  toggle() {
    this.timeRemaining = !this.timeRemaining;
    this.updateDisplay();
    this.save();
  }

  updateDisplay() {
    if (this.timeRemaining) {
      this.text = this.formatTime(this.time.duration - this.time.current);
    } else {
      this.text = this.formatTime(this.time.current);
    }
  }

  private load() {
    // deserialize
    const obj = <ITimeSettings>JSON.parse(localStorage.getItem(this.saveKey));
    // apply
    this.timeRemaining = obj?.timeRemaining || false;
    console.log(`time setting loaded`);
  }

  private save() {
    // collect
    const obj: ITimeSettings = {
      timeRemaining: this.timeRemaining
    };
    // serialize
    localStorage.setItem(this.saveKey, JSON.stringify(obj));
    console.log(`time setting saved`);
  }
}
