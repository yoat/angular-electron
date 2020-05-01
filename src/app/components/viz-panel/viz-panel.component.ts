import { StereoAudioData } from './../../models/audio-data.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';

@Component({
  selector: 'VizPanel',
  templateUrl: './viz-panel.component.html',
  styleUrls: ['./viz-panel.component.scss']
})
export class VizPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() side: "left" | "right" | "";
  @Input() height: number;
  @Input() width: number;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  display: string;
  count = 0;
  private ctx: CanvasRenderingContext2D;
  private visualizer;
  private presets = {};
  private presetName = "";
  private presetIdx = 0;
  private presetCount = 0;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.display = this.side.toLowerCase() == "left" ? "L" : "R";

    // this.playback.viz$.subscribe((sad: StereoAudioData) => {
    //   console.log(`audio data! ${this.display} ${this.count++}`); // ${sad.left.length} + ${sad.right.length}`);
    // });
    this.presets = butterchurnPresets.getPresets();
    this.presetCount = Object.keys(this.presets).length;
  }

  ngAfterViewInit() {
    this.visualizer = butterchurn.createVisualizer(this.playback.context, this.canvas.nativeElement, {
      width: +this.width || 400,
      height: +this.height || 300
    });

    this.visualizer.connectAudio(this.playback.source);
    // this.ctx = this.canvas.nativeElement.getContext('2d');

    this.loadPreset(0);
    // const preset = this.presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];
    // this.visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets
    // resize visualizer
    this.visualizer.setRendererSize(this.width, this.height);

    // render a frame
    this.render();
  }

  private render() {
    this.visualizer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }

  ngOnDestroy() {

  }

  get duration(): number {
    return 0.5;
  }

  loadPreset(idx: number, transition: number = 0) {
    this.presetIdx = idx;
    this.presetName = Object.keys(this.presets)[this.presetIdx];
    const preset = this.presets[this.presetName];
    this.visualizer.loadPreset(preset, transition);
  }

  nextPreset(transition: number = 0) {
    const idx = (this.presetIdx + 1 >= this.presetCount) ? 0 : this.presetIdx + 1;
    this.loadPreset(idx, transition);
  }

  prevPreset(transition: number = 0) {
    const idx = (this.presetIdx - 1 < 0) ? this.presetCount - 1 : this.presetIdx - 1;
    this.loadPreset(idx, transition);
  }

  nextButton() {
    this.nextPreset(this.duration);
  }

  prevButton() {
    this.prevPreset(this.duration);
  }

  randomButton() {
    this.loadPreset(Math.floor(this.presetCount * Math.random()), this.duration);
  }
}
