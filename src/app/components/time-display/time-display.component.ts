import { TimeUpdate } from './../../models/time-update.model';
import * as moment from "moment";
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'TimeDisplay',
  template: `<div class="time-display">{{ text }}</div>`,
  styleUrls: ['./time-display.component.css']
})
export class TimeDisplayComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  text: string;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.sub = this.playback.time$.subscribe((time: TimeUpdate) => {
      this.text = this.formatTime(time.current);
      // console.log(`time updated...`);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    return (isNaN(time)) ? "00:00:00" : moment.utc(time).format(format);
  }
}
