import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PlaylistComponent } from './playlist.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PlaylistComponent],
  imports: [CommonModule, SharedModule]
})
export class PlaylistModule { }
