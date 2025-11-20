/*
 * @Date: 2024-05-27 18:13:13
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { memo } from 'react';

import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { useStore } from '../../store';
import Button from './Button';
import { ShowCountDownTimeType } from './constant';
import { Card, ContentWrap, StyledTimeCountDown, Text } from './styled';
import { useMakeButtonConfig } from './useMakeButtonConfig';

const ActionBar = () => {
  const { config, onClick, loading, onPreClick } = useMakeButtonConfig();
  const { tip, btnText, timeType, styleType, tipCenterLayout } = config || {};
  const { state } = useStore();
  const { startTime, endTime } = state?.projectDetail || {};
  const showTime = timeType !== ShowCountDownTimeType.hidden;
  const { isH5 } = useDeviceHelper();
  const time = timeType === ShowCountDownTimeType.toStartTime ? startTime : endTime;
  if (!config) return null;

  return (
    <Card>
      <ContentWrap>
        <Text noTimeStyle={!showTime} tipCenterLayout={tipCenterLayout}>
          {tip?.()}
        </Text>
        {showTime && (
          <StyledTimeCountDown
            isH5={isH5}
            colorTheme="dark"
            value={time}
            intervalThemeConfig={{
              gapWidth: 6,
            }}
          />
        )}
      </ContentWrap>

      <Button onPreClick={onPreClick} loading={loading} onClick={onClick} styleType={styleType}>
        {btnText?.()}
      </Button>
    </Card>
  );
};

export default memo(ActionBar);
