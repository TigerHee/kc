/**
 * Owner: chrise@kupotech.com
 */
import React from 'react';
import Head from '@/components/CustomHead';
import ErrorPage from '@/routes/ErrorPage';
import { bootConfig } from 'kc-next/boot';
import { initBootConfigIfSSR } from '@/with-common-props';

const Error = ({ statusCode }) => {
  return (
    <>
      <Head>
        <meta name='robots' content='noindex' />
      </Head>
      <ErrorPage statusCode={statusCode} />
    </>
  );
};

Error.getInitialProps = (ctx) => {
  const { res, err } = ctx;
  //error 也初始化boot,避免依赖模块报错
  initBootConfigIfSSR(ctx);
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, _BOOT_CONFIG_: bootConfig };
};

export default Error;
