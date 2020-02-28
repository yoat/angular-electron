import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, merge, fromEvent, Subscription } from "rxjs";
import { tap, debounceTime, distinctUntilChanged } from "rxjs/operators";
@Component({
  selector: 'PlayButton',
  // templateUrl: './play-button.component.html',
  template: `<span class="btn" #button>▶</span>`,
  styleUrls: ['./play-button.component.css']
})
export class PlayButtonComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('button', { static: true }) vcButton: ElementRef;

  name = "Play";
  symbol = "▶";

  sub: Subscription;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sub = merge(
      fromEvent(this.vcButton.nativeElement, 'keyup'),
      fromEvent(this.vcButton.nativeElement, 'click'),
    ).pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        console.log(`${this.symbol} ${this.name}`);
      })
    ).subscribe();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
