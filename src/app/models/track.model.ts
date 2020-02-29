export class Track {
  path: string;
  trackId: number;
  trackName: string;
  artistId: number;
  artistName: string;
  albumId: number;
  albumName: string;

  constructor(props: any = {}) {
    Object.assign(this, props);
  }
}
