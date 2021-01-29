import { MessagingClient } from '../../../../src/MessagingClient';
import * as websocket from './websocket';
import { ConnectionStatus } from '../../../types';

const start = () => {
  const messagingClient = new MessagingClient({
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

  messagingClient.on('connect', () => {
    statusElem.innerHTML = 'connected' as ConnectionStatus;
  });
  messagingClient.on('disconnect', () => {
    statusElem.innerHTML = 'disconnected' as ConnectionStatus;
  });
  messagingClient.on('data', data => {
    messagesElem.innerHTML += `<p>${data.message}</p>`;
  });

  if (isHost) {
    console.log('hosting');
    messagingClient.host();
  } else {
    console.log('joining');
    messagingClient.join();
  }

  newMessageButton.addEventListener('click', () => {
    messagingClient.send({ message: newMessageInput.value });
    newMessageInput.value = '';
  });
};

websocket.onconnected(() => {
  start();
});
