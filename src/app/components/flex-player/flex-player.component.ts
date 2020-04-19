import { UtilService } from './../../services/util.service';
import { filter } from 'rxjs/operators';
import { IpcMessage } from './../../models/ipc.model';
import { IpcService } from './../../services/ipc.service';
import { PlaylistService } from './../../services/playlist.service';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-flex-player',
  templateUrl: './flex-player.component.html',
  styleUrls: ['./flex-player.component.scss']
})
export class FlexPlayerComponent implements OnInit {
  playlistShown: boolean;
  vizShown: boolean;
  constructor(private util: UtilService, private playback: PlaybackService, private playlist: PlaylistService, private ipc: IpcService) { }

  ngOnInit(): void {
    // this.playback.load(new Track());
    this.playback.nextTrack();

    this.ipc.message$.pipe(
      filter((msg: IpcMessage) => msg.target == "player")
    ).subscribe((msg: IpcMessage) => {
      // console.log(`Player received event: ${msg.event}`);
      this.handleIpcEvent(msg);
    });
  }

  dropped(event: DragEvent) {
    console.log(`dropped!`);
    event.preventDefault();
    // process the dropped files via accessing event.dataTransfer.items or event.dataTransfer.files.length
    event.dataTransfer.files
    for (let k = 0; k < event.dataTransfer.files.length; k++) {
      const v = event.dataTransfer.files.item(k);
      console.log('File(s) you dragged here: ', v.path);
      this.playlist.importFile(v.path);
    }
  }

  private handleIpcEvent(msg: IpcMessage) {
    switch (msg.event) {
      case "play":
        this.playback.play();
        break;
    }
  }

  onPush(event: string) {
    switch (event.toLowerCase()) {
      case "playlist":
        this.togglePlaylist();
        break;
      case "viz":
        this.toggleViz();
        break;
      case "pause":
        this.playback.pause();
        break;
      case "play":
        this.playback.play();
        break;
      case "stop":
        this.playback.stop();
        break;
      case "next":
        this.playback.nextTrack();
        break;
      case "prev":
        this.playback.prevTrack();
        break;
      case "max":
        this.util.maximizeWindow();
        break;
      case "min":
        this.util.minimizeWindow();
        break;
      case "close":
        this.util.closeWindow();
        break;
      case "mute":
        console.log(`Toggle Mute!`);
      case "render":
        this.playback.render();
        break;
      case "send":
        this.playback.sampleSend();
        break;
      default:
        console.log(`event ${event}`);
        break;
    }
  }

  togglePlaylist() {
    if (this.playlistShown) {
      this.hidePl();
    } else {
      this.showPl();
    }
    this.playlistShown = !this.playlistShown;
  }

  toggleViz() {
    if (this.vizShown) {
      this.hideViz();
    } else {
      this.showViz();
    }
    this.vizShown = !this.vizShown;
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

  showViz() {
    ipcRenderer.send('showWindow', {
      window: "viz"
    });
  }

  hideViz() {
    ipcRenderer.send('hideWindow', {
      window: "viz"
    });
  }
}
