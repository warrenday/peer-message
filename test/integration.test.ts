import createClient from './puppeteer';

jest.setTimeout(30 * 1000);

describe('MessagingClient Integration', () => {
  const host = createClient(true);
  const client = createClient(false);

  beforeEach(async () => {
    await host.open();
    await client.open();
    await host.waitForStatus('connected');
    await client.waitForStatus('connected');
  });

  afterEach(async () => {
    await host.close();
    await client.close();
  });

  it('connects a host to a client', async () => {
    await expect(host.waitForStatus('connected')).resolves.toBe(true);
    await expect(client.waitForStatus('connected')).resolves.toBe(true);
  });

  it('sends messages between host and client', async () => {
    await host.sendMessage('Hello from host');

    await expect(client.waitForMessage('Hello from host', 5000)).resolves.toBe(
      true
    );

    await client.sendMessage('Hello from client');

    await expect(host.waitForMessage('Hello from client', 5000)).resolves.toBe(
      true
    );
  });

  it('does not receive a message from itself when host', async () => {
    await host.sendMessage('Hello from host');

    await expect(
      host.waitForMessage('Hello from host', 5000)
    ).rejects.toThrow();
  });

  it('does not receive a message from itself when client', async () => {
    await client.sendMessage('Hello from client');

    await expect(
      client.waitForMessage('Hello from client', 5000)
    ).rejects.toThrow();
  });

  it('allows client to disconnect and re-connect', async () => {
    await client.close();
    await host.waitForStatus('disconnected', 30000);
    await client.open();

    await expect(host.waitForStatus('connected')).resolves.toBe(true);
    await expect(client.waitForStatus('connected')).resolves.toBe(true);
  });

  it('allows host to disconnect and re-connect', async () => {
    await host.close();
    await client.waitForStatus('disconnected', 30000);
    await host.open();

    await expect(host.waitForStatus('connected')).resolves.toBe(true);
    await expect(client.waitForStatus('connected')).resolves.toBe(true);
  });
});
