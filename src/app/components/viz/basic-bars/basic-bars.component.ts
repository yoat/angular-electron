import { PlaybackService } from './../../../services/playback.service';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

@Component({
  selector: 'VizBasicBars',
  template: '<div class="viz-panel"><canvas #canvas [height]="height" [width]="width"></canvas></div>',
  styleUrls: ['./basic-bars.component.css']
})
export class BasicBarsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() height: number;
  @Input() width: number;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;

  private active = true;
  private fftSize = 256;
  private bufferLength: number;
  private buffer: Uint8Array;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.a.fftSize = this.fftSize;
    this.bufferLength = this.a.frequencyBinCount;
    this.buffer = new Uint8Array(this.bufferLength);
  }

  ngAfterViewInit(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.render.apply(this);
  }

  ngOnDestroy(): void {
    // takeWhile(() => this.componentActive)
    this.active = false;
  }

  get a() {
    return this.playback.analyser;
  }

  get canvas(): HTMLCanvasElement {
    return (this.canvasRef.nativeElement as HTMLCanvasElement);
  }

  get ctx(): CanvasRenderingContext2D {
    return (this.canvasRef.nativeElement as HTMLCanvasElement).getContext("2d", {});
  }

  private render() {
    this.a.getByteFrequencyData(this.buffer);

    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    var barWidth = (this.width / this.bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) {
      barHeight = this.buffer[i] / 2;

      this.ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      this.ctx.fillRect(x, this.height - barHeight / 2, barWidth, barHeight);

      x += barWidth + 1;
    }

    window.requestAnimationFrame(this.render.bind(this));
  }
}
