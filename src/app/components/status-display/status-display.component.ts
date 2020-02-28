import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaybackService } from '../../services/playback.service';
import { PlaybackState } from '../../models/playback-state.model';

@Component({
  selector: 'StatusDisplay',
  // templateUrl: './status-display.component.html',
  template: '<span class="status-display-container">{{ status }}</span>',
  styleUrls: ['./status-display.component.css']
})
export class StatusDisplayComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  status: string;

  constructor(private playback: PlaybackService) { }

  ngOnInit(): void {
    this.sub = this.playback.observe().subscribe((state: PlaybackState) => {
      // console.log(`Change detected...`);
      this.status = state.symbol;
    });
  }

  ngOnDestroy() {

  }
}
