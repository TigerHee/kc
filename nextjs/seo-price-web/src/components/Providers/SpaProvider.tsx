import React from "react";
import dynamic from "next/dynamic";
import { getCurrentBaseName } from "kc-next/i18n";
import { AppInitialProps } from "next/app";
import InitialProvider from "gbiz-next/InitialProvider";
import "@/tools/i18n/client";

// 仅在客户端加载 BrowserRouter
const BrowserRouter = dynamic(
  () => import("react-router-dom").then((mod) => mod.BrowserRouter),
  { ssr: false }
);

const SpaProvider: React.FC<{
  children: React.ReactNode;
  pageProps: AppInitialProps;
}> = ({ children, pageProps }) => {
  const basename = getCurrentBaseName();

  return (
    <InitialProvider value={pageProps}>
      <BrowserRouter basename={basename}>
        <React.Suspense fallback={null}>{children}</React.Suspense>
      </BrowserRouter>
    </InitialProvider>
  );
};

export default SpaProvider;
