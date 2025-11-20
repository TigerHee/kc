/**
 * Owner: vijay.zhou@kupotech.com
 */
import { METHODS } from '../../enums';
import useLang from '../../hooks/useLang';
import { passkeysSupported } from '../../utils/webauthn-json';
import { PasskeyThinIcon, IIconProps } from '@kux/iconpack';

/** 验证方式编码 */
export const field = METHODS.PASSKEY;

/** 切换验证方式-名称 */
export const Name = ({ recommend, ...props }: React.HTMLAttributes<HTMLSpanElement> & { recommend: boolean }) => {
  const { t } = useLang();
  return (
    <span {...props}>{recommend ? t('ea76fe97aa6a4800ad2a') : t('55f65db0e0c04800abb8')}</span>
  );
};

/** 切换验证方式-图标 */
export const Icon = (props: IIconProps) => {
  return <PasskeyThinIcon {...props} />;
};

/** 插件是否启用 */
export const enable = () => passkeysSupported();

/** 是验证码插件 */
export const isOTP = () => false;
