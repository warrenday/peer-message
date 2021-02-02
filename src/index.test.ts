import { PeerMessage } from './PeerMessage';

jest.mock('simple-peer');

const mockConfig = {
  signal: {
    channel: 'some-channel',
    send: () => {},
    receive: () => {},
  },
};

describe('PeerMessage', () => {
  it('creates a new channel and becomes the channel host', () => {
    const client = new PeerMessage(mockConfig);
    client.host();

    expect(client.isHost).toBe(true);
  });

  it('joins a new channel without error', () => {
    const client = new PeerMessage(mockConfig);
    client.join();
  });

  it('adds an event listener', () => {
    const mockCallback = jest.fn();
    const client = new PeerMessage(mockConfig) as any;

    client.on('data', mockCallback);

    expect(client.callbacks).toEqual([
      {
        name: 'data',
        cb: mockCallback,
      },
    ]);
  });

  it('removes event listeners', () => {
    expect.assertions(3);

    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const client = new PeerMessage(mockConfig) as any;
    const remove1 = client.on('data', mockCallback1);
    const remove2 = client.on('data', mockCallback2);

    expect(client.callbacks).toEqual([
      {
        name: 'data',
        cb: mockCallback1,
      },
      {
        name: 'data',
        cb: mockCallback2,
      },
    ]);

    remove1();

    expect(client.callbacks).toEqual([
      {
        name: 'data',
        cb: mockCallback2,
      },
    ]);

    remove2();

    expect(client.callbacks).toEqual([]);
  });

  it('sends a stringified message', () => {
    const client = new PeerMessage(mockConfig) as any;
    client.peerClient = {
      send: jest.fn(),
    };

    client.send({ hello: 'world' });

    expect(client.peerClient.send).toHaveBeenCalledWith('{"hello":"world"}');
  });

  it('removes all event listeners', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const client = new PeerMessage(mockConfig) as any;
    client.on('data', mockCallback1);
    client.on('data', mockCallback2);

    client.removeAll();

    expect(client.callbacks).toEqual([]);
  });
});
