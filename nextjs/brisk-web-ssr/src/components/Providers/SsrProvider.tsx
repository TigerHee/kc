import PageProvider from 'gbiz-next/InitialProvider';
import { AppInitialProps } from 'next/app';
import React from 'react';
import CommonProvider from './CommonProvider';

const SsrProvider: React.FC<{
  children: React.ReactNode;
  pageProps: AppInitialProps;
}> = ({ children, pageProps }) => {
  return (
    <PageProvider value={pageProps}>
      <CommonProvider>{children}</CommonProvider>
    </PageProvider>
  );
};

export default SsrProvider;
