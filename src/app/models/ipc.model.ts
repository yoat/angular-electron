export interface IpcMessage {
  source?: string;
  target: string;
  event: string;
  data: any;
}