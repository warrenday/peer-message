import { PeerMessage } from '../../../../src';
import * as websocket from './websocket';
import { ConnectionStatus } from '../../../types';

const start = () => {
  const peerMessage = new PeerMessage<{ message: string }>({
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

  const isHost = document.location.search.includes('host=true');
  const statusElem = document.getElementById('status');
  const messagesElem = document.getElementById('messages');
  const newMessageInput = document.getElementById(
    'new-message-input'
  ) as HTMLInputElement;
  const newMessageButton = document.getElementById('new-message-button');

  statusElem.innerHTML === ('initial' as ConnectionStatus);

  peerMessage.on('connect', () => {
    statusElem.innerHTML = 'connected' as ConnectionStatus;
  });
  peerMessage.on('disconnect', () => {
    statusElem.innerHTML = 'disconnected' as ConnectionStatus;
  });
  peerMessage.on('data', data => {
    messagesElem.innerHTML += `<p>${data.message}</p>`;
  });

  if (isHost) {
    console.log('hosting');
    peerMessage.host();
  } else {
    console.log('joining');
    peerMessage.join();
  }

  newMessageButton.addEventListener('click', () => {
    peerMessage.send({ message: newMessageInput.value });
    newMessageInput.value = '';
  });
};

websocket.onconnected(() => {
  start();
});
