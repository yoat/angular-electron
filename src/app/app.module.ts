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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaylistButtonComponent } from './components/playlist-button/playlist-button.component';
import { ArtistDisplayComponent } from './components/artist-display/artist-display.component';
import { AlbumDisplayComponent } from './components/album-display/album-display.component';
import { BaseDisplayComponent } from './components/base-display/base-display.component';
import { TimeDisplayComponent } from './components/time-display/time-display.component';
import { VolumeSliderComponent } from './components/volume-slider/volume-slider.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, MediaComponent, DemoComponent, PlayerComponent, PlayButtonComponent, BaseButtonComponent, StatusDisplayComponent, PlaylistButtonComponent, ArtistDisplayComponent, AlbumDisplayComponent, BaseDisplayComponent, TimeDisplayComponent, VolumeSliderComponent],
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
