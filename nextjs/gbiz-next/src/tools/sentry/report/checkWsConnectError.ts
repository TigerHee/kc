import * as Sentry from '@sentry/nextjs';

export default function checkWsConnectError() {
  Sentry.captureEvent({
    message: `websocket: 重连5次依然失败`,
    level: 'error',
    tags: {
      requestError: 'websocketError',
    },
    fingerprint: ['websocket连接异常'],
  });
}