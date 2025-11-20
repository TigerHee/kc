/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import en_US from '@kc/footer/lib/locale/en_US';
import { Footer, LocaleProvider } from '@kc/footer/lib/componentsBundle';
import { hostConfig } from '../hostConfig';

const isDark = false;

const bg = isDark ? 'rgb(1, 8, 30)' : '#fff';

const Footers = () => {
  return (
    <div style={{ height: 1600, background: bg }}>
      <LocaleProvider locale={en_US}>
        <Footer currentLang="en_US" theme={isDark ? 'dark' : 'light'} {...hostConfig} />
      </LocaleProvider>
    </div>
  );
};

export default Footers;
