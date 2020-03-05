import { PlaylistComponent } from './playlist/playlist.component';
import { PlayerComponent } from './components/player/player.component';
import { DemoComponent } from './demo/demo.component';
import { MediaComponent } from './media/media.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: 'media',
    component: MediaComponent
  },
  {
    path: 'demo',
    component: DemoComponent
  },
  {
    path: 'player',
    component: PlayerComponent
  },
  {
    path: 'playlist',
    component: PlaylistComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
