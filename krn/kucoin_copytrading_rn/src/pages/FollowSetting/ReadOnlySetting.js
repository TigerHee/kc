import React, {memo, useEffect, useMemo} from 'react';
import {ScrollView} from 'react-native';
import {css} from '@emotion/native';

import {IsCancelTopTip} from './components/IsCancelTopTip';
import {CopyModePayloadType} from './constant';
import FixedAmountFormContent from './FixedAmountFormContent';
import FixedRateFormContent from './FixedRateFormContent';
import {BgWrap, ReadOnlyContent} from './styles';
const ReadOnlySetting = ({
  bannerNode,
  configInfo,
  fixedRateFormMethods,
  fixedAmountFormMethods,
}) => {
  const {status, copyMode} = configInfo || {};
  const isShowFixedRateForm = useMemo(
    () => copyMode === CopyModePayloadType.fixedRate,
    [copyMode],
  );

  useEffect(() => {
    if (isShowFixedRateForm) {
      fixedRateFormMethods.reset(configInfo);
      return;
    }
    fixedAmountFormMethods.reset(configInfo);
  }, [
    configInfo,
    fixedAmountFormMethods,
    fixedRateFormMethods,
    isShowFixedRateForm,
  ]);

  return (
    <BgWrap>
      <IsCancelTopTip status={status} />
      {bannerNode}
      <ReadOnlyContent>
        <ScrollView
          bounces={false}
          style={css`
            flex: 1;
          `}>
          {isShowFixedRateForm ? (
            <FixedRateFormContent
              status={status}
              readonly
              formMethods={fixedRateFormMethods}
            />
          ) : (
            <FixedAmountFormContent
              status={status}
              readonly
              formMethods={fixedAmountFormMethods}
            />
          )}
        </ScrollView>
      </ReadOnlyContent>
    </BgWrap>
  );
};

export default memo(ReadOnlySetting);
