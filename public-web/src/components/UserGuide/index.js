/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { css, EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { saTrackForBiz } from 'src/utils/ga';
import useAppInit from 'TradeActivity/hooks/useAppInit';
import { VIDEO_CONFIG } from './config';
import Introduce from './Introduce';
import { StyledPage, VideoTextWrapper, VideoWrapper } from './styledComponents';

const { SnackbarProvider } = Snackbar;
function UserGuide({ type }) {
  useAppInit();
  const { isRTL } = useLocale();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  useEffect(() => {
    // 曝光埋点
    saTrackForBiz({}, ['UserGuide', '1'], { type });
  }, [type]);

  const item = useMemo(() => {
    return VIDEO_CONFIG[type];
  }, [type]);

  if (!item) return null;

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <SnackbarProvider>
          <Global
            styles={css`
              ::-webkit-scrollbar {
                display: none !important;
                width: 0px !important;
              }
            `}
          />
          <StyledPage id="userGuidePage" data-inspector={`user-guide-${type}`}>
            <VideoWrapper>
              <div className="video">
                <iframe
                  src={item.videoUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Youtube-video"
                />
              </div>

              <VideoTextWrapper>{item.videoText()}</VideoTextWrapper>
            </VideoWrapper>
            <Introduce {...item} />
          </StyledPage>
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}

export default React.memo(UserGuide);
