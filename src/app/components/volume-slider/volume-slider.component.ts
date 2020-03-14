import { PlaybackService } from './../../services/playback.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { ConstantPool } from '@angular/compiler';

interface IVolume {
  volume: number;
}

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
  private saver: Subscription;
  private volumeKey = "cc-volume-v1";

  constructor(private playback: PlaybackService) {
    this.volValue = 30;
   }

  ngOnInit(): void {
    console.log(`${VolumeSliderComponent.sigmoid(6)} ${ VolumeSliderComponent.sigmoid(-6) }`);
    this.load();
    this.sub = fromEvent(this.vcVolume.nativeElement, 'input')
      .pipe(
        debounceTime(30),
        distinctUntilChanged()
      )
      .subscribe(() => this.readVolume());
    fromEvent(this.vcVolume.nativeElement, 'change')
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => this.save());
      // kludgey delay
    setTimeout(() => {
      this.playback.setVolume(VolumeSliderComponent.convertVolVal(this.volValue));
    }, 100);
    
  }

  readVolume() {
    // console.log(`volume: ${this.vcVolume.nativeElement.value}`);
    this.volValue = this.vcVolume.nativeElement.value;
    this.playback.setVolume(VolumeSliderComponent.convertVolVal(this.volValue));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  static sigmoid(t: number): number {
    return 1 / (1 + Math.pow(Math.E, -t));
  }

  static convertVolVal(input: number): number {
    if (input < 0) {
      return 0;
    } else if (input > 100) {
      return 1;
    } else {
      // return input * 0.01;
      const halfpi = Math.PI * 0.5;
      const conv = (input * 0.01);
      // return Math.sin(halfpi * conv);
      // return this.sigmoid((conv * 12 ) - 6);
      return (conv > 0.99) ? 1 : ((conv < 0.01) ? 0 : conv);
    }
  }

  private load() {
    // deserialize
    const obj = <IVolume>JSON.parse(localStorage.getItem(this.volumeKey));
    // apply
    this.volValue = obj?.volume || 70;
    console.log(`volume loaded`);
  }

  private save() {
    // collect
    const obj: IVolume = {
      volume: this.volValue
    };
    // serialize
    localStorage.setItem(this.volumeKey, JSON.stringify(obj));
    console.log(`volume saved`);
  }
}
