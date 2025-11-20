/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from 'emotion/index';
import createTheme from 'themes/createTheme';
import useMergedState from 'hooks/useMergedState';
import { BreakpointsContext } from 'context/index';
import { breakpoints as _breakpoints } from 'config/index';

function CusThemeProvider({ children, theme, palette = {}, breakpoints = {} }) {
  const [innerTheme, setInnerTheme] = useMergedState('light', {
    value: theme,
  });
  const commonBreakpoints = { ..._breakpoints, ...breakpoints };

  // 如果有外部传入的变量，则用外部的，无则用内部的
  const currentThemeValue = React.useMemo(() => {
    const customTheme = createTheme({
      palette: { mode: innerTheme, ...palette[innerTheme] },
      breakpoints: commonBreakpoints,
    });
    return {
      currentTheme: innerTheme,
      setTheme: (key) => setInnerTheme(key),
      ...customTheme,
    };
  }, [innerTheme, setInnerTheme, palette, commonBreakpoints]);

  return (
    <EmotionThemeProvider theme={currentThemeValue}>
      <BreakpointsContext.Provider value={{ breakpoints: commonBreakpoints }}>
        {children}
      </BreakpointsContext.Provider>
    </EmotionThemeProvider>
  );
}

export default CusThemeProvider;
