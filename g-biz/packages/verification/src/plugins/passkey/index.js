/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { METHODS } from '../../constants';
import useLang from '../../hooks/useLang';
import passkeySrc from '../../../static/passkey.svg';
import passkeyDarkSrc from '../../../static/passkey.dark.svg';
import { passkeysSupported } from '../../utils/webauthn-json';

/** 验证方式编码 */
export const field = METHODS.PASSKEY;

/** 切换验证方式-名称 */
export const Name = ({ recommend, ...props }) => {
  const { _t } = useLang();
  return (
    <span {...props}>{recommend ? _t('ea76fe97aa6a4800ad2a') : _t('55f65db0e0c04800abb8')}</span>
  );
};

/** 切换验证方式-图标 */
export const Icon = (props) => {
  const { currentTheme = 'light' } = useTheme();
  const map = {
    light: passkeySrc,
    dark: passkeyDarkSrc,
  };
  return <img src={map[currentTheme] ?? map.light} alt="icon" {...props} />;
};

/** 插件是否启用 */
export const enable = () => passkeysSupported();
