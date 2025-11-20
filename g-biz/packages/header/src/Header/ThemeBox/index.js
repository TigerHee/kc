import { useCallback } from 'react';
import { styled, useTheme } from '@kux/mui';
import { ICDarkModeOutlined, ICLightModeOutlined } from '@kux/icons';
import { useDispatch } from 'react-redux';
import storage from '@utils/storage';
import { kcsensorsManualTrack } from '../../common/tools';
import { useLang } from '../../hookTool';
import DarkImg from '../../../static/theme/dark.svg';
import LightImg from '../../../static/theme/light.svg';
import ThemeLightSvg from '../../../static/theme/theme-light.svg';
import ThemeDarkSvg from '../../../static/theme/theme-dark.svg';
import { namespace } from '../model';
import { captureThemeError } from '../tools';

export const NotificationWrapper = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 32px 32px;
  border: none;
  background: ${(props) => props.theme.colors.cover4};
  cursor: pointer;
  margin-left: 12px;
  ${(props) =>
    props.inTrade && {
      width: '32px',
      height: '32px',
    }}
  [dir='rtl'] & {
    margin-left: 0;
  }
`;

const ThemeTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const ThemeImg = styled.img`
  width: 40px;
  height: 24px;
  cursor: pointer;
`;

const ThemeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  [dir='rtl'] & {
    margin-right: 0px;
    margin-left: 8px;
  }
`;

function setStorageTheme(storageTheme) {
  try {
    storage.setItem('kc_theme', storageTheme, {
      isPublic: true,
    });
  } catch (e) {
    console.error('Error setting storage:', e);
    captureThemeError(`set storage theme failed - ${JSON.stringify(e)}`);
  }
}

export default function ThemeBox({ onChange, mainTheme, inTrade, inDrawer }) {
  const { currentTheme, colors } = useTheme();
  const { t } = useLang();
  const dispatch = useDispatch();
  const storageTheme = storage.getItem('kc_theme', { isPublic: true }) || mainTheme || 'light';

  const changeTheme = useCallback(() => {
    // 某些场景下需求header固定黑色，只切换主体内容，所以不能单纯的从header来同步主题
    // const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const newTheme = storageTheme === 'light' ? 'dark' : 'light';
    try {
      // 无需设置当前header，外部会传入主题色
      // setTheme(newTheme);
      if (onChange) {
        onChange(newTheme);
      }
      // 只有启用 AB，才能写 storage
      // 如果是 trade，但是也没有启用 AB，也不能写 storage
      setStorageTheme(newTheme);
      if (__env__ !== 'development') {
        dispatch({ type: `${namespace}/changeTheme`, payload: { theme: newTheme } });
      }
      kcsensorsManualTrack(['themeSwitch', '1'], { theme: newTheme });
    } catch (e) {
      console.error('theme change error', e);
      captureThemeError(`${newTheme} => ${newTheme}`);
    }
  }, [onChange, storageTheme]);

  if (inDrawer) {
    return (
      <>
        <ThemeTitle>
          <ThemeIcon src={currentTheme === 'light' ? ThemeLightSvg : ThemeDarkSvg} />
          <span>{t('kjuwvBXBQmnr1yWAwLZWwf')}</span>
        </ThemeTitle>
        {storageTheme === 'dark' ? (
          <ThemeImg src={DarkImg} onClick={changeTheme} />
        ) : (
          <ThemeImg src={LightImg} onClick={changeTheme} />
        )}
      </>
    );
  }

  return (
    <NotificationWrapper
      onClick={changeTheme}
      inTrade={inTrade}
      data-inspector="inspector_header_theme"
    >
      {storageTheme === 'dark' ? (
        <ICDarkModeOutlined size={inTrade ? 16 : 20} color={colors.text} />
      ) : (
        <ICLightModeOutlined size={inTrade ? 16 : 20} color={colors.text} />
      )}
    </NotificationWrapper>
  );
}
