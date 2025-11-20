// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { createTransport } from '@sentry/core';
import packageInfo from './package.json'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const DEPLOY_ENV =  process.env.NEXT_PUBLIC_DEPLOY_ENV;
const ENABLE_SENTRY = DEPLOY_ENV === 'pre' || DEPLOY_ENV === 'prod';

// 本来是不需要这个的，但是因为 cloudflare 拦截了上报请求，必须带上 content-type, user-agent, referer, content-length 四个请求头。
// 所以才在 server 端手动定义了上报函数。
// 四个 header 都是随便写的，没啥用，就是为了通过 cloudflare 的拦截。
// @see https://klarkchat.sg.larksuite.com/wiki/R5SSwQfqui6XFXkz4HflYobWgHZ
function makeFetchTransport(
    options
  ) {
    function makeRequest(request) {
      const requestOptions: RequestInit = {
        body: request.body,
        // agent,
        method: 'POST',
        referrerPolicy: 'origin',
        headers: {
        //   'content-type': 'application/json',
        //   'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        //   'referer': '/',
        //   'content-length': String(request.body.length),
          ...options.headers,
        },
        ...options.fetchOptions,
      };
  
      return fetch(options.url, requestOptions as any).then(response => {
        return {
          statusCode: response.status,
          headers: {
            'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
            'retry-after': response.headers.get('Retry-After'),
          },
        };
      });
    }
  
    return createTransport(options, makeRequest);
  }

Sentry.init({
  dsn: SENTRY_DSN,
  environment: DEPLOY_ENV,
  release: `${packageInfo.name}@${packageInfo.version}`,
  sampleRate: 1,
  tracesSampleRate: 0.001,
  integrations: [
    Sentry.eventFiltersIntegration()
  ],
  debug: false,
  // @ts-ignore
  transport: makeFetchTransport,
  _experiments: {
    enableLogs: true,
  },
  // 线下环境不上报
   beforeSend: (event, hint) => {
    //   return ENABLE_SENTRY ? event : null
    return event
   }
});
globalThis.Sentry = Sentry