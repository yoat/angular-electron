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
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  display: string;
  count = 0;
  private ctx: CanvasRenderingContext2D;
  private visualizer;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.display = this.side.toLowerCase() == "left" ? "L" : "R";

    // this.playback.viz$.subscribe((sad: StereoAudioData) => {
    //   console.log(`audio data! ${this.display} ${this.count++}`); // ${sad.left.length} + ${sad.right.length}`);
    // });
  }

  ngAfterViewInit() {
    this.visualizer = butterchurn.createVisualizer(this.playback.context, this.canvas.nativeElement, {
      width: 100,
      height: 100
    });

    this.visualizer.connectAudio(this.playback.source);
    // this.ctx = this.canvas.nativeElement.getContext('2d');
    const presets = butterchurnPresets.getPresets();
    const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

    this.visualizer.loadPreset(preset, 0.0); // 2nd argument is the number of seconds to blend presets

    // resize visualizer

    this.visualizer.setRendererSize(100, 100);

    // render a frame

    this.render();
  }

  private render() {
    this.visualizer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
  ngOnDestroy() {

  }

}
