import React from "react";
import { AppInitialProps } from "next/app";
import InitialProvider from "gbiz-next/InitialProvider";
import CommonProvider from "./CommonProvider";

const SsrProvider: React.FC<{
  children: React.ReactNode;
  pageProps: AppInitialProps;
}> = ({ children, pageProps }) => {


  return (
    <InitialProvider value={pageProps}>
      <CommonProvider>{children}</CommonProvider>
    </InitialProvider>
  );
};

export default SsrProvider;
