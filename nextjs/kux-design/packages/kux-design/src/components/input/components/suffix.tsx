/**
 * Owner: jacky.zhou@kupotech.com
 *
 * @description Input Suffix
 */

import { isNullValue } from '@/common/input';
import { IInputProps, IInputSuffixBoxProps } from '../type';
import { CloseFilledIcon, EyeCloseIcon, EyeOpenIcon, LoadingSmallIcon } from '@kux/iconpack';
import { clsx } from '@/common';

export const InputSuffixBox = (props: IInputSuffixBoxProps) => {
  const suffix = getSuffix(props);
  const addonAfter = getAddonAfter(props);

  const isSuffixNull = isNullValue(suffix);
  const isAddonAfterNull = isNullValue(addonAfter);

  if (!isSuffixNull || !isAddonAfterNull) {
    return (
      <span
        className={clsx('kux-input-suffixbox', {
          'kux-input-suffixbox-reverse': props.reverseSuffix,
        })}
      >
        {isSuffixNull ? null : <span className="kux-input-suffix">{suffix}</span>}
        {isAddonAfterNull ? null : <span className="kux-input-addonafter">{addonAfter}</span>}
      </span>
    );
  }

  return null;
};

function getSuffix(
  props: IInputProps & {
    onClear: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  },
) {
  const size = props.size === 'mini' ? 14 : 20;
  if (props.loading || props.type === 'password') return null;
  if (props.allowClear) {
    return (
      <CloseFilledIcon
        size={size}
        className="kux-input-clear-icon"
        onClick={(e) => props.onClear?.(e as any as React.MouseEvent<HTMLElement, MouseEvent>)}
      />
    );
  }
  return props.suffix;
}

function getAddonAfter(
  props: IInputProps & {
    pwsType: boolean;
    /**
     * 点击图标遮盖或展示密码
     */
    onPwsStatusChange: (status: boolean) => void;
  },
) {
  if (props.loading) {
    return <LoadingSmallIcon size={20} className="kux-input-loading-icon" />;
  }
  if (props.type === 'password') {
    const Icon = props.pwsType ? EyeCloseIcon : EyeOpenIcon;
    return (
      <Icon
        size={20}
        className="kux-input-pwd-icon"
        onClick={() => props.onPwsStatusChange?.(!props.pwsType)}
      />
    );
  }
  return props.addonAfter;
}
