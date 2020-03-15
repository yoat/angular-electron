
export interface ISong {
  id?: number,
  title: string,
  artist: string,
  album: string
}

export class Song implements ISong {
  id?: number;
  title: string;
  artist: string;
  album: string;
  constructor() { }
}