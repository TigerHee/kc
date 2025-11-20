import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import styled from '@emotion/native';

import {
  RadioCheckedIcon,
  RadioCheckedSolidIcon,
  RadioIcon,
} from 'components/Common/SvgIcon';
import {mediumHitSlop} from 'constants/index';
import {RowWrap} from 'constants/styles';
import {convertPxToReal} from 'utils/computedPx';

const RadioPressWrap = styled.Pressable`
  margin-right: 8px;

  ${({disabled}) => {
    if (disabled) {
      return `
        opacity: 0.4
      `;
    }
  }};
`;

const RadioText = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 500;
  line-height: 18.2px;
`;

export const EnhanceRadioType = {
  solid: 'solid', //圆圈实心样式
  check: 'check', //打勾样式
};

const EnhanceRadio = memo(
  ({
    style,
    children,
    checked,
    disabled,
    key,
    onChange,
    sizeNumber = 16,
    type = EnhanceRadioType.solid,
    value,
  }) => {
    const onPress = useMemoizedFn(() => {
      if (disabled) {
        return;
      }
      onChange?.(value);
    });

    return (
      <RowWrap style={style} key={key}>
        <RadioPressWrap
          hitSlop={mediumHitSlop}
          onPress={onPress}
          disabled={disabled}>
          {checked ? (
            <>
              {type === EnhanceRadioType.check && (
                <RadioCheckedIcon sizeNumber={convertPxToReal(sizeNumber)} />
              )}

              {type === EnhanceRadioType.solid && (
                <RadioCheckedSolidIcon
                  sizeNumber={convertPxToReal(sizeNumber)}
                />
              )}
            </>
          ) : (
            <RadioIcon sizeNumber={convertPxToReal(sizeNumber)} />
          )}
        </RadioPressWrap>
        {!React.isValidElement(children) ? (
          <RadioText>{children}</RadioText>
        ) : children ? (
          children
        ) : null}
      </RowWrap>
    );
  },
);
export default EnhanceRadio;
