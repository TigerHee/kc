import {useMemoizedFn, useThrottleFn} from 'ahooks';
import React, {memo} from 'react';
import {css} from '@emotion/native';
import {commonBridge} from '@krn/bridge';
import {useTheme} from '@krn/ui';

import Slider from 'components/Common/Slider';
import TrackMark from './TrackMark';

const LeverageSlider = props => {
  const {colorV2} = useTheme();
  const {trackMarks, value, onChange, style, ...others} = props;

  const {run: triggerVibration} = useThrottleFn(
    () => {
      commonBridge.vibrate();
    },
    {
      leading: true,
      trailing: false,
      wait: 500,
    },
  );

  const onInnerChange = useMemoizedFn(val => {
    if (value === val) return;
    triggerVibration();
    onChange?.(val);
  });

  return (
    <Slider
      {...others}
      hiddenThumbTopLabel
      value={value}
      trackMarks={trackMarks}
      onValueChange={onInnerChange}
      renderTrackMarkComponent={idx => {
        if (!trackMarks) return null;
        const isCovered = value >= trackMarks[idx];
        return <TrackMark style={style} isCovered={isCovered} />;
      }}
      trackStyle={css`
        height: 2px;
        background-color: ${colorV2.cover4};
      `}
      showLeverageThumb
    />
  );
};

export default memo(LeverageSlider);
