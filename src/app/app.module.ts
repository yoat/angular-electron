import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';

import { AppComponent } from './app.component';
import { MediaComponent } from './media/media.component';
import { DemoComponent } from './demo/demo.component';
import { PlayerComponent } from './components/player/player.component';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { BaseButtonComponent } from './components/base-button/base-button.component';
import { StatusDisplayComponent } from './components/status-display/status-display.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaylistButtonComponent } from './components/playlist-button/playlist-button.component';
import { ArtistDisplayComponent } from './components/artist-display/artist-display.component';
import { AlbumDisplayComponent } from './components/album-display/album-display.component';
import { BaseDisplayComponent } from './components/base-display/base-display.component';
import { TimeDisplayComponent } from './components/time-display/time-display.component';
import { VolumeSliderComponent } from './components/volume-slider/volume-slider.component';
import { BalanceSliderComponent } from './components/balance-slider/balance-slider.component';
import { ProgressScrubberComponent } from './components/progress-scrubber/progress-scrubber.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ProButtonComponent } from './components/pro-button/pro-button.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faSquare, faCheckSquare, faPlay, faPause, faStop, faStepBackward, faStepForward, faWindowClose, faWindowMaximize, 
  faWindowMinimize, faWindowRestore, faRedoAlt as faReplay, faCog as faSettings, faVolumeUp, faVolumeDown, faVolumeMute, 
  faVolumeOff, faCat, faListAlt as faPlaylist, faPoll as faViz, faCaretSquareRight as faPlayer,
  faRecordVinyl as faAlbum, faUsers as faArtist, faMusic as faTrack,
  faBalanceScale, faBalanceScaleLeft, faBalanceScaleRight
} from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
//  https://fontawesome.com/cheatsheet
// window-maximize, window-close, window-minimize
// hamburger (menu) skull-crossbones cat bong cannabis burn cubes hand-middle-finger
// hand-rock hand-scissors hand-paper hand-peace
// play/-circle, stop/-circle, pause/-circle, fast/step-/backward, fast/step-/forward
// volume- up, mute, down, off, redo (replay), wrench (settings), cog (settings), tools
// list, list-alt, list-ol, list-ul, th-list (playlist)
// random, sliders-h (sliders-v?), 
// poll (viz), wave-square (oscillo)
// video, video-slash
// balance-scale, balance-scale-left, balance-scale-right
// book, book-open
// record-vinyl (album), music (track), users, grin-stars, headphones, headphones-alt,
@NgModule({
  declarations: [AppComponent, MediaComponent, DemoComponent, PlayerComponent, PlayButtonComponent, BaseButtonComponent, StatusDisplayComponent, PlaylistButtonComponent, ArtistDisplayComponent, AlbumDisplayComponent, BaseDisplayComponent, TimeDisplayComponent, VolumeSliderComponent, BalanceSliderComponent, ProgressScrubberComponent, PlaylistComponent, ProButtonComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatSliderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(
      faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, 
      faPlay, faPause,  faStop, faStepBackward, faStepForward, faWindowClose, faWindowMaximize, 
      faWindowMinimize, faWindowRestore, faReplay, faSettings, faVolumeUp, faVolumeDown, 
      faVolumeMute, faVolumeOff, faCat, faPlaylist, faViz, faPlayer, faAlbum, faArtist, faTrack,
      faBalanceScale, faBalanceScaleLeft, faBalanceScaleRight
    );
  }
}
