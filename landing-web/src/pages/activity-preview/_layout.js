/**
 * Owner: terry@kupotech.com
 */

 import React from 'react';
 import KuFoxThemeProvider from '@kufox/mui/ThemeProvider';

 export default ({ children }) => {
   return <KuFoxThemeProvider>{children}</KuFoxThemeProvider>;
 };
 
