import {useMemoizedFn} from 'ahooks';
import React, {memo, useCallback, useMemo} from 'react';
import {css} from '@emotion/native';

import KrnInput from './KrnInput';

const mergeEnhanceStyles = ({inputContainer, tipsView, ...others}) => ({
  inputContainer: css`
    padding-top: 0;
    ${inputContainer};
  `,
  tipsView: css`
    height: 0;
    padding-top: 0;
    ${tipsView}
  `,
  ...others,
});

const Input = ({
  onChange,
  styles = {},
  // 输入数字模式
  numberMode = false,
  // 允许输入的数字小数位数 numberMode需为 true
  allowDecimalNum = Number.MAX_SAFE_INTEGER,
  maxLength,
  ...rest
}) => {
  const enhanceStyles = useMemo(() => mergeEnhanceStyles(styles), [styles]);

  const maxLengthValid = maxLength > 0;

  const enhanceOnchange = useMemoizedFn(val => {
    if (maxLengthValid && val?.length > maxLength) {
      return;
    }
    onChange(val);
  });

  const handleChangeText = useCallback(
    event => {
      const {text: originText} = event?.nativeEvent || {};

      if (!numberMode) {
        return enhanceOnchange(originText);
      }
      // 输入逗号转小数点
      const text = originText?.replace?.(',', '.');
      // 允许数字和小数点
      const regex = new RegExp(`^\\d*\\.?\\d{0,${allowDecimalNum}}$`);
      if (regex.test(text)) {
        enhanceOnchange(text);
      }
    },
    [allowDecimalNum, numberMode, enhanceOnchange],
  );

  return (
    <KrnInput styles={enhanceStyles} onChange={handleChangeText} {...rest} />
  );
};

export default memo(Input);
