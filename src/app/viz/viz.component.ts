import { Component, OnInit } from '@angular/core';

import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css']
})
export class VizComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(`viz component waiting...`);
    ipcRenderer.on('viz-data', (event, arg) => {
      console.log(arg) // prints "pong"
    })
  }

}
