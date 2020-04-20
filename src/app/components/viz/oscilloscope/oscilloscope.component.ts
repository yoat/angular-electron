import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'VizOscilloscope',
  template: '<div class="viz-panel"><canvas #canvas [height]="height" [width]="width"></canvas></div>',
  styleUrls: ['./oscilloscope.component.css']
})
export class OscilloscopeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() height: number;
  @Input() width: number;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  private active = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    // takeWhile(() => this.componentActive)
    this.active = false;
  }
}
