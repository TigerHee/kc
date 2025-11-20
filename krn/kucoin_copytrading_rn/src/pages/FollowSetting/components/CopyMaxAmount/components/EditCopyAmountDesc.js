import {useMemoizedFn, useToggle} from 'ahooks';
import React, {memo} from 'react';
import {ScrollView} from 'react-native';
import {css} from '@emotion/native';

import {
  CopyAmountChangeDescArrow,
  TinyWarning,
} from 'components/Common/SvgIcon';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {DescText, DescWrap, FirstPressableLine} from './styles';
const EditCopyAmountDesc = props => {
  const {isAddDirection} = props;
  const [isCollapsed, {toggle}] = useToggle(true);
  const {_t} = useLang();
  const toggleTextCollapse = useMemoizedFn(() => {
    toggle();
  });

  return (
    <DescWrap>
      <RowWrap>
        <FirstPressableLine onPress={toggleTextCollapse}>
          <TinyWarning />
          <DescText
            style={css`
              flex: 1;
              margin-left: 8px;
            `}>
            {_t('c82e133d95474000af84')}
          </DescText>
          <CopyAmountChangeDescArrow isUp={!isCollapsed} />
        </FirstPressableLine>
      </RowWrap>
      {!isCollapsed && (
        <ScrollView
          style={css`
            margin-top: 12px;
            padding-right: 24px;
            max-height: 160px;
          `}>
          <DescText>{`●  ${_t('66f6db2e8b7d4000a7e7')}`}</DescText>
          <DescText>{`●  ${_t('69ff67ea23e84000aba6')}`}</DescText>
          <DescText>{`●  ${_t('9a4c0dc943604000a583')}`}</DescText>
          {!isAddDirection && (
            <DescText>{`●  ${_t('7f404db64fd24000a70b')}`}</DescText>
          )}
        </ScrollView>
      )}
    </DescWrap>
  );
};

export default memo(EditCopyAmountDesc);
