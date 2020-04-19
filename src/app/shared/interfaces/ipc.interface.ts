export interface ICreateWindow {
    name: string;
    show?: boolean;
    foreground?: boolean;
    debug?: boolean;
    fullscreen?: boolean;
    position?: Vector2D;
    size?: Vector2D;
}

export interface Vector2D {
    x: number;
    y: number;
}
