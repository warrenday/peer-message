import SimplePeer from 'simple-peer';
import { EventEmitter } from './EventEmitter';
import { SignalingClient, SignalMessage } from './SignalingClient';

type IceConfig = {
  url?: string;
  urls?: string;
  username?: string;
  credentials?: string;
}[];
type SignalConfig = {
  channel: string;
  send: (message: string) => void;
  receive: (update: (message: string) => void) => void;
};
type PeerMessageArgs = {
  signal: SignalConfig;
  iceConfig?: IceConfig;
};

export interface Events<D> {
  data: D;
  connect: void;
  disconnect: void;
  error: Error;
}

const defaultIceConfig: IceConfig = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
];

export class PeerMessage<D extends {}> extends EventEmitter<Events<D>> {
  public isHost: boolean = false;
  private iceConfig: IceConfig;
  private peerClient?: SimplePeer.Instance;
  private signalingClient: SignalingClient;

  constructor({ signal, iceConfig }: PeerMessageArgs) {
    super();

    this.iceConfig = iceConfig || defaultIceConfig;
    this.signalingClient = new SignalingClient(signal.channel);
    this.setupSignaling(signal, this.signalingClient);
  }

  private setupSignaling = (
    signal: SignalConfig,
    signalingClient: SignalingClient
  ) => {
    signalingClient.setSender(signal.send);
    signal.receive(message => {
      const { channel, event, data }: SignalMessage<'signal'> = JSON.parse(
        message
      );
      if (channel === signalingClient.getChannel()) {
        signalingClient.emit(event, data);
      }
    });
  };

  private handleSignaling = (peerClient: SimplePeer.Instance) => {
    this.signalingClient.on('signal', data => {
      if (data) {
        peerClient.signal(data);
      }
    });
    peerClient.on('signal', data => {
      this.signalingClient.send('signal', data);
    });
  };

  private handleMessaging = (peerClient: SimplePeer.Instance) => {
    peerClient.on('connect', () => {
      this.emit('connect', undefined);
      this.signalingClient.removeAll();
    });
    peerClient.on('data', message => {
      this.emit('data', JSON.parse(message));
    });
  };

  private handleError = (peerClient: SimplePeer.Instance) => {
    const destroyPeerClient = () => {
      this.peerClient = undefined;
      if (peerClient) {
        peerClient.destroy();
      }
    };
    peerClient.on('error', err => {
      console.error(err);
      this.emit('error', err);
    });
    peerClient.on('close', () => {
      destroyPeerClient();
      this.emit('disconnect', undefined);
      if (this.isHost) {
        this.host();
      } else {
        this.join();
      }
    });
  };

  private initializePeerClient = (isHost: boolean) => {
    const peerClient = new SimplePeer({
      initiator: isHost,
      trickle: true,
      config: {
        iceServers: this.iceConfig,
      },
    });
    this.peerClient = peerClient;

    this.handleSignaling(peerClient);
    this.handleMessaging(peerClient);
    this.handleError(peerClient);
  };

  host = () => {
    this.isHost = true;

    this.signalingClient.on('readyToPair', () => {
      this.signalingClient.send('readyToPair');
    });
    this.signalingClient.on('readyToSignal', () => {
      this.initializePeerClient(this.isHost);
    });
    this.signalingClient.send('readyToPair');
  };

  join = () => {
    this.isHost = false;

    this.signalingClient.on('readyToPair', () => {
      this.initializePeerClient(this.isHost);
      this.signalingClient.send('readyToSignal');
    });
    this.signalingClient.send('readyToPair');
  };

  send = (message: D) => {
    if (this.peerClient) {
      this.peerClient.send(JSON.stringify(message));
    }
  };
}
