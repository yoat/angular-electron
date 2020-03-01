import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

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

  constructor() {
    this.volValue = 70;
   }

  ngOnInit(): void {
    this.sub = fromEvent(this.vcVolume.nativeElement, 'input')
      .subscribe((x) => {
        console.log(`volume: ${this.vcVolume.nativeElement.value}`);
        this.volValue = this.vcVolume.nativeElement.value;
      });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
