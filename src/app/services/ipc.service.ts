import { Subject } from 'rxjs';
import { IpcMessage } from './../models/ipc.model';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { PlaybackService } from './../services/playback.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private channel = 'cc-ipc-msg';
  private messageSource = new Subject<IpcMessage>();
  message$ = this.messageSource.asObservable();

  constructor() { 
    ipcRenderer.on(this.channel, (event: IpcRendererEvent, args: IpcMessage) => {
      // console.log("renderer.js::" + JSON.stringify(args)); // prints "ping"
      this.messageSource.next(args);
    });
    // console.log(`IpcService initialized!`);
  }

  send(source: string, target: string, event: string, data: any) {
    const payload: IpcMessage = {
      source,
      target,
      event,
      data
    };
    ipcRenderer.send(this.channel, payload);
  }
}
