import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'VizPanel',
  templateUrl: './viz-panel.component.html',
  styleUrls: ['./viz-panel.component.scss']
})
export class VizPanelComponent implements OnInit {
  @Input() side: "left" | "right" | "";
  display: string;

  constructor() { }

  ngOnInit(): void {
    this.display = this.side.toLowerCase() == "left" ? "L" : "R";
  }

}
