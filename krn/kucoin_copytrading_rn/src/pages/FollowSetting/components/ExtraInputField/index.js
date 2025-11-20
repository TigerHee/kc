import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import {InputField} from 'components/Common/Form';
import TipTrigger from 'components/Common/TipTrigger';
import {ExtraItemWrap, LabelWrap} from './styles';

export const ExtraInputField = memo(props => {
  const {
    extraLeftNode = null,
    label,
    labelColor,
    labelTip,
    extraRightNode = null,
    ...others
  } = props;
  return (
    <View>
      <InputField
        label={
          <LabelWrap>
            <TipTrigger
              textStyle={css`
                font-size: 14px;
                font-weight: 500;
                line-height: 18.2px;
              `}
              showUnderLine={false}
              showIcon
              text={label}
              textColor={labelColor}
              message={labelTip}
            />

            {/* <LabelText>{label}</LabelText> */}
            {/* {labelTip && <TipIcon source={infoIc} />} */}
          </LabelWrap>
        }
        {...others}
      />

      {(!!extraLeftNode || !!extraRightNode) && (
        <ExtraItemWrap>
          {extraLeftNode}
          {extraRightNode}
        </ExtraItemWrap>
      )}
    </View>
  );
});

export const ExtraNumberInputField = memo(props => {
  const {allowDecimalNum = 2, ...others} = props;

  return (
    <ExtraInputField
      {...others}
      numberMode
      allowDecimalNum={allowDecimalNum}
      originInputProps={{
        keyboardType: 'numeric', // 设置键盘类型为数字键盘
      }}
    />
  );
});
