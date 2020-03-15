import Dexie from 'dexie';
import { Song, ISong } from '../models/song.model';

export class WebampDatabase extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  songs: Dexie.Table<ISong, number>; // number = type of the primkey
  //...other tables goes here...

  constructor() {
    super("WebampDatabase");
    this.version(1).stores({
      songs: '++id, title, artist, album',
      //...other tables goes here...
    });
    this.songs.mapToClass(Song);
  }
}


