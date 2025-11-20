/**
 * Owner: tiger@kupotech.com
 * 一些公共的provider容器抽离
 */
import { ThemeProvider, Snackbar, Global } from '@kux/mui';
import RootEmotionCacheProvider from './RootEmotionCacheProvider';

export default ({ children, ...props }) => {
  return (
    <ThemeProvider {...props}>
      <RootEmotionCacheProvider>
        <Snackbar.SnackbarProvider>{children}</Snackbar.SnackbarProvider>
      </RootEmotionCacheProvider>
      <Global
        styles={`
            body fieldset {
              min-width: initial;
              padding: initial;
              margin: initial;
              border: initial;
              margin-inline-start: 2px;
              margin-inline-end: 2px;
              padding-block-start: 0.35em;
              padding-inline-start: 0.75em;
              padding-inline-end: 0.75em;
              padding-block-end: 0.625em;
            }
            body legend {
              width: initial;
              padding: initial;
              padding-inline-start: 2px;
              padding-inline-end: 2px;
            }
          `}
      />
    </ThemeProvider>
  );
};
