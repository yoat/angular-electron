import { ipcRenderer } from 'electron';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-button',
  // templateUrl: './playlist-button.component.html',
  template: `<button class="btn" (click)="toggle()">📜</button>`,
  styleUrls: ['./playlist-button.component.css']
})
export class PlaylistButtonComponent implements OnInit {
  shown = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    if (this.shown) {
      this.hidePl();
    } else {
      this.showPl();
    }
    this.shown = !this.shown;
  }

  showPl() {
    ipcRenderer.send('showWindow', {
      window: "playlist"
    });
  }

  hidePl() {
    ipcRenderer.send('hideWindow', {
      window: "playlist"
    });
  }
}
