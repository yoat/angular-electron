export interface ITimeUpdate {
  current: number;
  duration: number;
}

export class TimeUpdate {
  current: number;
  duration: number;

  constructor(update: ITimeUpdate) {
    Object.assign(this, update);
  }

  static initial(): TimeUpdate {
    return new TimeUpdate({ 
      current: 0, 
      duration: 0
    });
  }
}
