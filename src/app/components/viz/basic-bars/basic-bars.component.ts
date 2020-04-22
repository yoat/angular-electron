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
  private fftSize = 1024;
  private bufferLength: number;
  private buffer: Uint8Array;
  private _node: AnalyserNode;
  private _osc: OscillatorNode;

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
    if (!this._node) {
      //this._node = this.playback.getConnectedAnalyser();
      this._osc = this.playback.context.createOscillator();
      this._osc.type = 'sine';
      // this._osc.frequency.setValueAtTime(400, this.playback.context.currentTime); // value in hertz
      this.updateFreq();
      this._osc.start();

      this._node = this.playback.context.createAnalyser();
      this._osc.connect(this._node);
    }
    return this._node;
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
      barHeight = this.buffer[i] * 2;

      this.ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
      this.ctx.fillRect(x, this.height - (barHeight / 2), barWidth, barHeight);

      x += barWidth + 1;
    }

    this.updateFreq();

    window.requestAnimationFrame(this.render.bind(this));
  }

  freq = 440;
  minFreq = 10;
  maxFreq = 8000;
  change = 10;
  private updateFreq() {
    this.freq += this.change;

    if (this.freq > this.maxFreq || this.freq < this.minFreq) {
      this.change *= -1;
    }

    this._osc.frequency.setValueAtTime(this.freq, this.playback.context.currentTime); // value in hertz

  }
}
