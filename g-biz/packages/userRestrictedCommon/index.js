/**
 * Owner: iron@kupotech.com
 */
import { ThemeProvider } from '@kux/mui';
import withI18nReady from '@hooks/withI18nReady';
import InnerDialog from './src/components/Dialog';
import InnerBaseDialog from './src/components/Dialog/BaseDialog';
import OriUserRestricted from './src/index';

export const UserRestricted = withI18nReady(OriUserRestricted, 'userRestricted');

const ThemeDialog = ({ theme, ...restProps }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <InnerDialog {...restProps} />
    </ThemeProvider>
  );
};
const ThemeBaseDialog = ({ theme, ...restProps }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <InnerBaseDialog {...restProps} />
    </ThemeProvider>
  );
};

export const Dialog = withI18nReady(ThemeDialog, 'userRestricted');
export const BaseDialog = withI18nReady(ThemeBaseDialog, 'userRestricted');
