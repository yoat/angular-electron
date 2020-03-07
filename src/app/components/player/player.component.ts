import { UtilService } from './../../services/util.service';
import { filter } from 'rxjs/operators';
import { IpcMessage } from './../../models/ipc.model';
import { IpcService } from './../../services/ipc.service';
import { PlaylistService } from './../../services/playlist.service';
import { PlaybackService } from './../../services/playback.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
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
        break;
      default:
        console.log(`event ${event}`);
        break;
    }
  }
}
