import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import styled, {css} from '@emotion/native';
import {Video} from '@krn/ui';
import * as Sentry from '@sentry/react-native';

import {ErrorBoundary} from 'components/Common/ErrorBoundary';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {convertPxToReal} from 'utils/computedPx';
import {Panel} from './components/Panel';
import {ContentTitle, Text60} from './styles';

const StyledContentTitle = styled(ContentTitle)`
  margin: 16px 0 12px;
`;

const StyledVideo = styled(Video)`
  height: ${convertPxToReal(192.7)};
  width: ${convertPxToReal(340)};
  border-radius: 7px;
`;

const StyledVideoWrap = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  border-radius: 7px;
  height: ${convertPxToReal(192.7)};
  overflow: hidden;
`;

const OVER_VIEW_INTRO_VIDEO =
  'https://assets.staticimg.com/static/video/KuCoin_Copy_Trading.mp4';

const OVER_VIEW_INTRO_VIDEO_POSTER =
  'https://assets.staticimg.com/cms/media/LuDhJWArzeRLHKmfEfNS0s3vOvvA6DOqp3VCMuuNp.png';

const OverviewPanel = () => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const trackVideoClick = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'video_click',
      locationId: '1',
    });
  });

  return (
    <Panel>
      <TouchableWithoutFeedback onPress={trackVideoClick}>
        <ErrorBoundary>
          <StyledVideoWrap>
            <StyledVideo
              Sentry={Sentry}
              poster={OVER_VIEW_INTRO_VIDEO_POSTER}
              src={OVER_VIEW_INTRO_VIDEO}
            />
          </StyledVideoWrap>
        </ErrorBoundary>
      </TouchableWithoutFeedback>
      <StyledContentTitle>{_t('f99287a9e8014000a184')}</StyledContentTitle>
      <Text60>{_t('0b46380d86c54000a829')}</Text60>
      <StyledContentTitle>{_t('4dd07b7c12434000a0d6')}</StyledContentTitle>
      <Text60>{_t('c082c231c5564000a562')}</Text60>
      <Text60
        style={css`
          margin-top: 12px;
        `}>
        {_t('7cdb8eb7c1434000adb1')}
      </Text60>
      <StyledContentTitle>{_t('e23789ea27c94000a5b8')}</StyledContentTitle>
      <Text60>{_t('a7c39808066d4000ae16')}</Text60>
    </Panel>
  );
};

export default memo(OverviewPanel);
