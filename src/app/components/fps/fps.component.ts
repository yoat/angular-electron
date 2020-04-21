import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'FPSCounter',
  template: '<div>{{fps}}fps</div>',
  styleUrls: ['./fps.component.css']
})
export class FpsComponent implements OnInit, OnDestroy {
  fps: number;
  times: Array<number> = [];
  active = true;

  constructor() { }

  ngOnInit(): void {
    this.refreshLoop();
  }

  ngOnDestroy() {
    this.active = false;
  }

  refreshLoop() {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (this.times.length > 0 && this.times[0] <= now - 1000) {
        this.times.shift();
      }
      this.times.push(now);
      this.fps = this.times.length;
      this.refreshLoop();
    });
  }
}
