const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

const createBroadcaster = ws => {
  return data => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
};

wss.on('connection', function connection(ws) {
  const broadcast = createBroadcaster(ws);
  ws.on('message', broadcast);
});
