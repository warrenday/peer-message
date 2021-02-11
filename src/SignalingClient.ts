import { EventEmitter } from './EventEmitter';

type Sender = (message: string) => void;

type Events = {
  signal: Record<string, any>;
  readyToPair: void;
  readyToSignal: void;
};

export type SignalMessage<T extends keyof Events> = {
  event: keyof Events;
  data?: Events[T];
};

export class SignalingClient extends EventEmitter<Events> {
  private sender?: Sender;

  constructor() {
    super();
  }

  send = <T extends keyof Events>(eventType: T, data?: Events[T]) => {
    if (!this.sender) {
      return;
    }

    const signalMessage: SignalMessage<T> = {
      event: eventType,
      data,
    };
    this.sender(JSON.stringify(signalMessage));
  };

  setSender = (sender: Sender) => {
    this.sender = sender;
  };
}
