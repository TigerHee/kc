import React, {memo, useCallback} from 'react';
import {Button as KButton, useTheme} from '@krn/ui';

/**
 * @param {object} props - 组件的属性
 * @param {string} props.loading - 按钮展示 loading  默认 false
 * @param {string} props.type - primary, secondary  默认:primary
 * @param {string} props.size - 按钮的大小，large: 48px, default 40px, small: 32px 默认default
 * @param {boolean} props.disabled - 按钮是否禁用
 * @param {object} props.style - 按钮的自定义样式
 * @param {object} props.textStyle - 按钮文字自定义样式
 * @param {function} props.onPress - 按钮的点击事件
 * @param {string} props.children - 按钮的文字
 */
const Button = props => {
  const {loading = false, disabled, onPress, type, ...others} = props;
  const {colorV2} = useTheme();

  const innerOnPress = useCallback(() => {
    if (loading) {
      return;
    }
    onPress?.();
  }, [loading, onPress]);

  return (
    <KButton
      onPress={innerOnPress}
      type={type}
      disabled={disabled || loading}
      loading={{
        spin: loading,
        color: type === 'secondary' ? colorV2.text : colorV2.backgroundMajor,
        size: 'small',
      }}
      {...others}
    />
  );
};

export default memo(Button);

Button.displayName = 'Button';
