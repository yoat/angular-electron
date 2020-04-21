import { PlaybackService } from './../../../services/playback.service';
import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API

@Component({
  selector: 'VizOscilloscope',
  template: '<div class="viz-panel"><canvas #canvas [height]="height" [width]="width"></canvas></div>',
  styleUrls: ['./oscilloscope.component.css']
})
export class OscilloscopeComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() height: number;
  @Input() width: number;
  @ViewChild('canvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;

  private active = true;
  private bufferLength: number;
  private buffer: Uint8Array;
  private count = 0;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
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
    // console.log(`oscilloscope render ${this.count++}`);
    this.a.getByteTimeDomainData(this.buffer);

    this.ctx.fillStyle = 'rgb(200, 200, 200)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    this.ctx.beginPath();

    var sliceWidth = this.width * 1.0 / this.bufferLength;
    var x = 0;

    for (var i = 0; i < this.bufferLength; i++) {

      var v = this.buffer[i] / 128.0;
      var y = v * this.height / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    } 
    this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    this.ctx.stroke();

    window.requestAnimationFrame(this.render.bind(this));
  };
}
