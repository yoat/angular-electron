import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
declare var MediaElementPlayer;

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, AfterViewInit {
  @ViewChild('mediaPlayer') mediaPlayerElement: ElementRef;
  public mediaPlayer;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.loadMediaPlayer();
  }

  loadMediaPlayer() {
    this.mediaPlayer = new MediaElementPlayer(this.mediaPlayerElement.nativeElement);
  }
}
