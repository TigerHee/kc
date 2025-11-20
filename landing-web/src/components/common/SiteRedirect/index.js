/**
 * Owner: brick@kupotech.com
 */
import useTheme from '@kufox/mui/hooks/useTheme';
import { useSelector } from 'hooks';
import systemDynamic from 'utils/systemDynamic';
import keysEquality from 'utils/tools/keysEquality';

const SiteRedirect = systemDynamic('@remote/siteRedirect');

export default () => {
  const theme = useTheme();
  const { isInApp } = useSelector((state) => state.app, keysEquality(['isInApp']));
  const { currentLang } = useSelector((state) => state.app, keysEquality(['currentLang']));

  if (isInApp) {
    return null;
  }

  return <SiteRedirect theme={theme.currentTheme} currentLang={currentLang} />;
};
