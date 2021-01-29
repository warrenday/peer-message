import { EventEmitter } from './EventEmitter';
import { MessageData } from './types';

type Sender = (message: string) => void;
type EventType = 'signal' | 'readyToPair' | 'readyToSignal';
type EventCallback = (data?: MessageData) => void;
export type SignalMessage = {
  channel: string;
  event: EventType;
  data?: MessageData;
};

export class SignalingClient extends EventEmitter<EventType, EventCallback> {
  private sender?: Sender;
  private channel: string;

  constructor(channel: string) {
    super();
    this.channel = channel;
  }

  send = (eventType: EventType, data?: MessageData) => {
    if (!this.channel || !this.sender) {
      return;
    }

    const signalMessage: SignalMessage = {
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
