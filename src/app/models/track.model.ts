export interface ITrack {
  path: string;
  trackId: number;
  trackName: string;
  artistId: number;
  artistName: string;
  albumId: number;
  albumName: string;
}

export class Track implements ITrack {
  path: string;
  trackId: number;
  trackName: string;
  artistId: number;
  artistName: string;
  albumId: number;
  albumName: string;

  constructor(props: ITrack) {
    Object.assign(this, props);
  }

  static initial(): Track {
    return new Track({
      path: "",
      trackId: 0,
      trackName: "",
      artistId: 0,
      artistName: "",
      albumId: 0,
      albumName: "",
    });
  }
}
