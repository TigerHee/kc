import { useCallback, useEffect } from 'react';
import { useTheme } from '@kux/design';
import clsx from 'clsx';
import { DarkModeIcon, LightModeIcon } from '@kux/iconpack';
import { kcsensorsManualTrack } from '../../common/tools';
import { useTranslation } from 'tools/i18n';
import DarkImg from '../../static/theme/dark.svg';
import LightImg from '../../static/theme/light.svg';
import ThemeLightSvg from '../../static/theme/theme-light.svg';
import ThemeDarkSvg from '../../static/theme/theme-dark.svg';
import { captureThemeError } from '../tools';
import { _DEV_ } from 'tools/env';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';
import { usePageProps } from 'provider/PageProvider';
import { setGlobalTheme } from 'tools/theme';
interface ThemeBoxProps {
  onChange: (theme: string) => void;
  inTrade?: boolean;
  inDrawer?: boolean;
}

export default function ThemeBox({ onChange, inTrade, inDrawer }: ThemeBoxProps) {
  const theme = useTheme();
  const { t } = useTranslation('header');

  const pageProps = usePageProps();
  // 获取主工程主题
  const mainTheme = pageProps?.mainTheme || pageProps?.theme || 'light';

  const changeCookieTheme = useHeaderStore(state => state.changeTheme);

  const changeTheme = useCallback(() => {
    // 某些场景下需求header固定黑色，只切换主体内容，所以不能单纯的从header来同步主题
    const newTheme = mainTheme === 'light' ? 'dark' : 'light';

    try {
      if (onChange) {
        onChange(newTheme);
      }
      setGlobalTheme(newTheme);
      changeCookieTheme?.({ theme: newTheme });

      kcsensorsManualTrack(['themeSwitch', '1'], { theme: newTheme });
    } catch (e) {
      console.error('theme change error', e);
      captureThemeError(`${newTheme} => ${newTheme}`);
    }
  }, [onChange, mainTheme]);

  if (inDrawer) {
    return (
      <>
        <div className={styles.themeTitle}>
          <img className={styles.themeIcon} src={theme === 'light' ? ThemeLightSvg : ThemeDarkSvg} />
          <span>{t('kjuwvBXBQmnr1yWAwLZWwf')}</span>
        </div>
        {mainTheme === 'dark' ? (
          <img className={styles.themeImg} src={DarkImg} onClick={changeTheme} />
        ) : (
          <img className={styles.themeImg} src={LightImg} onClick={changeTheme} />
        )}
      </>
    );
  }

  return (
    <button className={clsx(styles.notificationWrapper)} onClick={changeTheme} data-inspector="inspector_header_theme">
      {mainTheme === 'dark' ? (
        <DarkModeIcon size={16} color="var(--kux-text)" />
      ) : (
        <LightModeIcon size={16} color="var(--kux-text)" />
      )}
    </button>
  );
}
