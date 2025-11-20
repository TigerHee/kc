import React, {memo, useLayoutEffect} from 'react';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import Header from 'components/Common/Header';
import useGoBack from 'hooks/useGoBack';
import useTracker from 'hooks/useTracker';
import {ApplyTraderGetSelectAvatarManager} from './FillApplyTraderForm/helper';
import DynamicShowStep from './DynamicShowStep';
import {Wrap} from './styles';

const ApplyTrader = () => {
  const {onClickTrack} = useTracker();
  const goBack = useGoBack();
  const {colorV2} = useTheme();

  useLayoutEffect(() => {
    ApplyTraderGetSelectAvatarManager.reset();
  }, []);

  const onPressBack = () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'back',
    });
    goBack();
  };

  return (
    <Wrap>
      <Header
        style={css`
          background-color: ${colorV2.overlay};
        `}
        contentStyle={css`
          background-color: ${colorV2.overlay};
        `}
        onPressBack={onPressBack}
      />
      <DynamicShowStep />
    </Wrap>
  );
};

export default memo(ApplyTrader);
