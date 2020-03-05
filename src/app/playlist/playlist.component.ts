import { IpcService } from './../services/ipc.service';
import { IpcMessage } from './../models/ipc.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(private ipc: IpcService) { }

  ngOnInit(): void {
  }

}
