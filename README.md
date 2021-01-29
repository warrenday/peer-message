# Peer Message

Fast peer to peer messaging through WebRTC

## Problem

Sending data between clients on the web is inherently slow due to two reasons.

1. Data must travel from client -> server -> client. This means a longer round trip for your data and increased latency.

2. Data is sent using TCP, this favoures reliability over speed as packets must be delivered in the correct order.

## Solution

WebRTC is an open standard for sending information directly between clients. This technology supports video and voice but also arbitrary data. By utilising this we can acheive sub 80ms messaging between clients.
[Read more about WebRTC](https://webrtc.org/)

## Installation

`npm i peer-message`

## Usage Example

```ts
import { PeerMessage } from 'peer-message';

const peerMessage = new PeerMessage(...args);

peerMessage.on('data', data => {
  // handle data
});

peerMessage.on('connect', () => {
  peerMessage.send('hello world');
});

peerMessage.host();
```

## Documentation

### PeerMessage

Create a new instance of PeerMessage which accepts signaling config and optional iceConfig.

```ts
const peerMessage = new PeerMessage({
  iceConfig: [],
  signal: {
    channel: 'test-channel',
    send: data => {
      websocket.send(data);
    },
    receive: update => {
      websocket.onmessage(data => {
        update(data);
      });
    },
  },
});
```

### on

Listen for events.

Possible events are

connect - Clients have successully established a connection  
disconnect - The connection between two clients was lost or closed  
data - Data was received from a remote client  
error - An error has occured

```ts
peerMessage.on('data', () => {});
```

### send

Send data to a remote client. Objects are stringified/parsed automatically.

```ts
peerMessage.send({ hello: 'world' });
```

### host

Host a channel

```ts
peerMessage.host();
```

### join

Connect to a host

```ts
peerMessage.join();
```

## Signaling

Signaling is needed in order for two peers to share how they should connect. Usually this is solved through a regular HTTP-based Web API (i.e., a REST service or WebSockets) where web applications can relay the necessary information before the peer connection is initiated.

PeerMessage makes signaling easy. Here is an example of signaling using websockets. You simply need to relay the information given and received.

```ts
const start = () => {
  const peerMessage = new PeerMessage({
    iceConfig: [],
    signal: {
      channel: 'test-channel',
      send: data => {
        websocket.send(data);
      },
      receive: update => {
        websocket.onmessage(data => {
          update(data);
        });
      },
    },
  });
};

websocket.onconnected(() => {
  start();
});
```

## IceConfig

Clients may not be able to connect directly if they are behind a NAT or when connecting over a mobile network such as 3/4G. You can read more detail on this here [https://bloggeek.me/webrtc-turn/](https://bloggeek.me/webrtc-turn/)

We provide a default config pointing to free stun servers hosted by google. However you should not rely on this for production.

```json
[
  { "urls": "stun:stun.l.google.com:19302" },
  { "urls": "stun:global.stun.twilio.com:3478?transport=udp" }
]
```

Here is an example of using turn/stun config provided by twilio. [https://www.twilio.com/stun-turn](https://www.twilio.com/stun-turn)

```ts
const peerMessage = new PeerMessage({
  iceConfig: [
    {
      url: 'stun:global.stun.twilio.com:3478?transport=udp',
      urls: 'stun:global.stun.twilio.com:3478?transport=udp',
    },
    {
      url: 'turn:global.turn.twilio.com:3478?transport=udp',
      username:
        '9e4b5cd9b97055a182295750fcf27000a51fd167d43061f379a49002bc9d5ef5',
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      credential: 'jf308/4r9+uPbeEYn+ho918XDlVWVWcdtWJ/Bd7R1eP=',
    },
    {
      url: 'turn:global.turn.twilio.com:3478?transport=tcp',
      username:
        '9e4b5cd9b97055a182295750fcf27000a51fd167d43061f379a49002bc9d5ef5',
      urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
      credential: 'jf308/4r9+uPbeEYn+ho918XDlVWVWcdtWJ/Bd7R1eP=',
    },
    {
      url: 'turn:global.turn.twilio.com:443?transport=tcp',
      username:
        '9e4b5cd9b97055a182295750fcf27000a51fd167d43061f379a49002bc9d5ef5',
      urls: 'turn:global.turn.twilio.com:443?transport=tcp',
      credential: 'jf308/4r9+uPbeEYn+ho918XDlVWVWcdtWJ/Bd7R1eP=',
    },
  ],
});
```

## Test App

See our example test app for a complete example with signaling

[Test App](./test/test-app)

## Licence

The MIT License (MIT)

Copyright (c) 2020 GraphQL Mock Network Authors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`
