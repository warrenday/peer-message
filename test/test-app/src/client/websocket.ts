const ws = new WebSocket(`ws://${location.hostname}:3000`);

export const send = (data: string) => {
  ws.send(data);
};

export const onmessage = (cb: (data: string) => void) => {
  ws.onmessage = (messageEvent: MessageEvent) => {
    cb(messageEvent.data);
  };
};

export const onconnected = (cb: () => void) => {
  ws.onopen = cb;
};
