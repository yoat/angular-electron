import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IpcService } from './../services/ipc.service';
import { IpcMessage } from './../models/ipc.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  constructor(private ipc: IpcService) { }

  ngOnInit(): void {
    console.log(`playlist onInit`);
    
    this.ipc.message$.pipe(
      filter((msg: IpcMessage) => msg.target == "playlist")
    ).subscribe((msg: IpcMessage) => {
      console.log(`Playlist received event: ${msg.event}`);
    });
  }

  ngOnDestroy() {

  }

  test() {
    this.ipc.send("playlist", "player", "play", {});
  }
}
