import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import {useGetFormSceneStatus} from './hooks/useGetFormSceneStatus';
import {useRewriteFormDetail} from './hooks/useRewriteFormDetail';
import {EditFormLayout} from './EditFormLayout';
import ReadOnlySetting from './ReadOnlySetting';

const SceneLayout = ({
  fixedRateFormMethods,
  fixedAmountFormMethods,
  bannerNode,
  handleChangeTab,
}) => {
  const {isReadonly} = useGetFormSceneStatus();
  const {data: configInfo} = useRewriteFormDetail();

  if (isReadonly) {
    return (
      <ReadOnlySetting
        bannerNode={bannerNode}
        configInfo={configInfo}
        fixedRateFormMethods={fixedRateFormMethods}
        fixedAmountFormMethods={fixedAmountFormMethods}
      />
    );
  }

  return (
    <View
      style={css`
        flex: 1;
      `}>
      {bannerNode}
      <EditFormLayout
        fixedRateFormMethods={fixedRateFormMethods}
        fixedAmountFormMethods={fixedAmountFormMethods}
        handleChangeTab={handleChangeTab}
      />
    </View>
  );
};
export default memo(SceneLayout);
