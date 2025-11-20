import React, { FC } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SSRHelmet: FC<{ children: React.ReactNode; ssr?: boolean }> = ({ ssr = true, children }) => {
  return ssr ? (
    children
  ) : (
    <HelmetProvider>
      <Helmet>{children}</Helmet>
    </HelmetProvider>
  );
};

export default SSRHelmet;
