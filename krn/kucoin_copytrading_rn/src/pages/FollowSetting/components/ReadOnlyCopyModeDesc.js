import React, {memo} from 'react';
import styled from '@emotion/native';

import useLang from 'hooks/useLang';
import {CopyModePayloadType} from '../constant';
import SecondaryFieldLabel from './SecondaryFieldLabel';

const DescWrap = styled.View`
  padding: 16px 0 8px 0;
`;

const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.text};
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
`;

const ReadOnlyCopyModeDesc = ({readonly = false, copyMode}) => {
  const {_t} = useLang();
  const text =
    copyMode === CopyModePayloadType.fixedRate
      ? _t('ac10631ee6b74000a1de')
      : _t('ac78f8ba5e5d4000acdb');

  if (!readonly) {
    return null;
  }

  return (
    <DescWrap>
      <SecondaryFieldLabel title={_t('fdccbcacf2034000a375')} />

      <Label>{text}</Label>
    </DescWrap>
  );
};

export default memo(ReadOnlyCopyModeDesc);
