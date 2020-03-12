import { PlaybackService } from './../../services/playback.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

interface IBalance {
  balance: number;
}

@Component({
  selector: 'BalanceSlider',
  templateUrl: './balance-slider.component.html',
  styleUrls: ['./balance-slider.component.css']
})
export class BalanceSliderComponent implements OnInit {
  @ViewChild('balance', { static: true }) vcBalance: ElementRef;
  balValue: number;
  private sub: Subscription;

  constructor(private playback: PlaybackService) { 
    this.balValue = 0;
  }


  ngOnInit(): void {
    this.sub = fromEvent(this.vcBalance.nativeElement, 'input')
      .pipe(
        debounceTime(30),
        distinctUntilChanged()
      )
      .subscribe(() => this.readBalance());
    this.playback.setVolume(BalanceSliderComponent.convertBalVal(this.balValue));
  }

  readBalance() {
    // console.log(`volume: ${this.vcBalance.nativeElement.value}`);
    this.balValue = this.vcBalance.nativeElement.value;
    this.playback.setBalance(BalanceSliderComponent.convertBalVal(this.balValue));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  static convertBalVal(input: number): number {
    if (input < 0) {
      return 0;
    } else if (input > 100) {
      return 1;
    } else {
      // return input * 0.01;
      // return Math.abs(input) * input * 0.0001;
      const conv = input * 0.01;
      return (Math.abs(conv) <= 0.05) ? 0 : conv;
    }
  }
}
