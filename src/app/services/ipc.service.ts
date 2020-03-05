import { IpcMessage } from './../models/ipc.model';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { PlaybackService } from './../services/playback.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private channel = 'cc-ipc-msg';

  constructor() { 
    ipcRenderer.on(this.channel, (event: IpcRendererEvent, args: IpcMessage) => {
      console.log("renderer.js::" + JSON.stringify(args)); // prints "ping"
      // my.load(arg.path);
    });
    console.log(`IpcService initialized!`);
  }
}
