/**
 * Owner: willen@kupotech.com
 */
import { useContext } from 'react';
import { CurrentThemeContext } from 'context';
import theme from 'theme';

const useTheme = () => {
  const { currentTheme, cstyle, options } = useContext(CurrentThemeContext) || {};
  return theme(currentTheme, cstyle, options);
};

export default useTheme;
