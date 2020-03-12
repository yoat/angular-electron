import { StereoAudioData } from './../../models/audio-data.model';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'VizPanel',
  templateUrl: './viz-panel.component.html',
  styleUrls: ['./viz-panel.component.scss']
})
export class VizPanelComponent implements OnInit {
  @Input() side: "left" | "right" | "";
  display: string;
  count = 0;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.display = this.side.toLowerCase() == "left" ? "L" : "R";

    this.playback.viz$.subscribe((sad: StereoAudioData) => {
      console.log(`audio data! ${this.display} ${this.count++}`); // ${sad.left.length} + ${sad.right.length}`);
    });
  }

}
