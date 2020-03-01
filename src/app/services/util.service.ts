import { Injectable } from '@angular/core';
import { remote } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
  }

  minimizeWindow() {
    var window = remote.getCurrentWindow();
    window.minimize();
    console.log('minimize');
  }

  maximizeWindow() {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
      window.maximize();
      console.log('maximize');
    } else {
      window.unmaximize();
      console.log('unmaximize');
    }
  }

}
