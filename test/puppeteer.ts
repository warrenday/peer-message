import puppeteer from 'puppeteer';
import { ConnectionStatus } from './types';

const WAIT_TIMEOUT = 30 * 1000;

const createClient = (isHost: boolean) => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const open = async (): Promise<void> => {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--allow-file-access-from-files',
        '--disable-translate',
      ],
    });
    page = await browser.newPage();
    await page.goto(`http://localhost:3001?host=${isHost}`, {
      waitUntil: 'networkidle2',
    });
  };

  const close = async (): Promise<void> => {
    await browser.close();
  };

  const sendMessage = async (messaage: string): Promise<void> => {
    const input = await page.$('#new-message-input');
    const button = await page.$('#new-message-button');
    await input?.type(messaage);
    await button?.click();
  };

  const waitForMessage = async (
    messageToFind: string,
    timeout: number = WAIT_TIMEOUT
  ): Promise<boolean> => {
    await page.waitForFunction(
      (message: string) => {
        const messages = Array.from(
          document.querySelectorAll('#messages p')
        ).map(node => node.textContent);
        return messages.includes(message);
      },
      { timeout },
      messageToFind
    );
    return true;
  };

  const waitForStatus = async (
    connectionStatus: ConnectionStatus,
    timeout: number = WAIT_TIMEOUT
  ): Promise<boolean> => {
    await page.waitForFunction(
      expectedStatus => {
        const status = document.getElementById('status')?.innerHTML;
        return status === expectedStatus;
      },
      { timeout },
      connectionStatus
    );
    return true;
  };

  return {
    open,
    close,
    sendMessage,
    waitForMessage,
    waitForStatus,
  };
};

export default createClient;
