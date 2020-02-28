import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  
  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.playback.load();
  }

}
