import { EventEmitter } from './EventEmitter';

type Sender = (message: string) => void;

type Events = {
  signal: Record<string, any>;
  readyToPair: void;
  readyToSignal: void;
};

export type SignalMessage<T extends keyof Events> = {
  channel: string;
  event: keyof Events;
  data?: Events[T];
};

export class SignalingClient extends EventEmitter<Events> {
  private sender?: Sender;
  private channel: string;

  constructor(channel: string) {
    super();
    this.channel = channel;
  }

  send = <T extends keyof Events>(eventType: T, data?: Events[T]) => {
    if (!this.channel || !this.sender) {
      return;
    }

    const signalMessage: SignalMessage<T> = {
      channel: this.channel,
      event: eventType,
      data,
    };
    this.sender(JSON.stringify(signalMessage));
  };

  setSender = (sender: Sender) => {
    this.sender = sender;
  };

  getChannel = () => {
    return this.channel;
  };
}
