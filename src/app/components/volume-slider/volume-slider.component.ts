import { PlaybackService } from './../../services/playback.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, fromEvent } from 'rxjs';

@Component({
  selector: 'VolumeSlider',
  // template: ``,
  templateUrl: './volume-slider.component.html',
  styleUrls: ['./volume-slider.component.css']
})
export class VolumeSliderComponent implements OnInit, OnDestroy {
  @ViewChild('volume', { static: true }) vcVolume: ElementRef;
  volValue: number;
  private sub: Subscription;

  constructor(private playback: PlaybackService) {
    // TODO: load from centralized storage...
    this.volValue = 70;
   }

  ngOnInit(): void {
    this.sub = fromEvent(this.vcVolume.nativeElement, 'input')
      .pipe(
        debounceTime(30),
        distinctUntilChanged()
      )
      .subscribe((x) => {
        console.log(`volume: ${this.vcVolume.nativeElement.value}`);
        this.volValue = this.vcVolume.nativeElement.value;

        this.playback.setVolume(VolumeSliderComponent.convertVolVal(this.volValue));
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  static convertVolVal(input: number): number {
    if (input < 0) {
      return 0;
    } else if (input > 100) {
      return 1;
    } else {
      // return input * 0.01;
      return input * input * 0.0001;
    }
  }
}
