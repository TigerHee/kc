/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kux/mui';
import Layout, { withLayout } from './_Layout';

interface LayoutWithThemeProps {
  theme?: 'light' | 'dark'; // Replace with actual theme type if available
  [key: string]: any; // Add index signature for other props
}

const LayoutWithTheme: React.FC<LayoutWithThemeProps> & { withLayout: typeof withLayout } = (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Layout {...props} slots={props.slots} >{props.children}</Layout>
    </ThemeProvider>
  );
};

LayoutWithTheme.withLayout = withLayout;

export default LayoutWithTheme;
