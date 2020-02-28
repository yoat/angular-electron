import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, merge, fromEvent } from "rxjs";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
@Component({
  selector: 'PlayButton',
  // templateUrl: './play-button.component.html',
  template: `<span class="btn" #button>▶</span>`,
  styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent implements OnInit {
  @ViewChild('button', { static: true }) vcButton: ElementRef;

  name = "Play";
  symbol = "▶";

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    merge(
      fromEvent(this.vcButton.nativeElement, 'keyup'),
      fromEvent(this.vcButton.nativeElement, 'click'),
    ).pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        console.log(`${this.symbol} ${this.name}`);
      })
    ).subscribe();

  }
}
