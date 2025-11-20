/**
 * !! 重要！
 * 该 Provider 禁止修改，如有调整请联系基建组!
 */
import React, { createContext, useContext, useEffect, useState } from "react";
export interface PageProps {
  _nextI18Next: any;
  statusCode: string | number;
  isApp: boolean;
  _setInitialProps: (data: Record<string, any>) => {}; // 用于withCSR
  [key: string]: any;
}

export const InitialContext = createContext<PageProps | null>(null);

export default function InitialProvider({ value, children }) {
  const [_initialProps, _setInitialProps] = useState({});
  const externalProps = value || {};

  return (
    <InitialContext.Provider
      value={{ ..._initialProps, _setInitialProps, ...externalProps }}
    >
      {children}
    </InitialContext.Provider>
  );
}

export function useInitialProps() {
  const pageProps: PageProps | null = useContext(InitialContext);
  try {
    if (pageProps && Number(pageProps.statusCode) === 404) {
      return null;
    }
    return pageProps;
  } catch (e) {
    console.log("Initial props get error:", e);
    return null;
  }
}
