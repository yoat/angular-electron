import { Subscription, merge, fromEvent } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ProButton',
  templateUrl: './pro-button.component.html',
  styleUrls: ['./pro-button.component.scss']
})
export class ProButtonComponent implements AfterViewInit, OnDestroy {
  @Input() name: string;
  @Output() push = new EventEmitter<string>();
  @ViewChild('button', { static: true }) vcButton: ElementRef;
  inputSub: Subscription;

  constructor() { }

  ngAfterViewInit() {
    this.inputSub = merge(
      fromEvent(this.vcButton.nativeElement, 'keyup'),
      fromEvent(this.vcButton.nativeElement, 'click'),
    ).pipe(
      debounceTime(20),
      distinctUntilChanged(),
      tap(() => {
        this.push.emit(this.name);
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
  }

}
