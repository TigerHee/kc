/*
 * @Date: 2024-05-27 16:55:14
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import { useLocale } from '@kucoin-base/i18n';
import { ThemeProvider } from '@kux/mui';
import numberFormat from '@kux/mui/utils/numberFormat';
import { useMemo } from 'react';
import ButtonGroup from 'routes/SlothubPage/components/ButtonGroup';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import DateTimeUTCFormat from 'src/routes/SlothubPage/components/mui/DateTimeUTCFormat';
import { PROJECT_ACTIVITY_STATUS } from 'src/routes/SlothubPage/constant';
import { formatHotAmount } from 'src/routes/SlothubPage/utils';
import { _t, _tHTML } from 'src/tools/i18n';
import hotIcon from 'static/slothub/detail-banner-hot-icon.svg';
import { useStore } from '../../store';
import BreadCrumb from './BreadCrumb';
import { BANNER_BG_MAP } from './constant';
import RightCoinIcon from './RightCoinIcon';
import {
  BannerTextWrap,
  Content,
  DescText,
  DescTimeText,
  HotAmount,
  LeftBg,
  OuterContentWrap,
  PadBottomCardWrap,
  Title,
  Wrap,
} from './styled';

const EnhanceLayoutRightCoinIcon = styled(RightCoinIcon)`
  position: absolute;

  ${(props) => props.theme.breakpoints.up('lg')} {
    top: -76px;
    left: -107px;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    position: absolute;
    top: 50px;
    right: -78px;
    z-index: 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    top: 8px;
    right: -42px;
  }
`;

const DetailBanner = (props) => {
  const { contentNode } = props;
  const { isRTL } = useLocale();

  const { isPad, isH5, isPC } = useDeviceHelper();
  const isBottomCardLayout = isPad || isH5;
  const { state } = useStore();
  const { projectDetail, activityStatus } = state;
  const { displayAmount, startTime, endTime, hot, rewardCurrency = '' } = projectDetail || {};
  const { currentLang } = useLocale();

  const isShowHot = useMemo(
    () => !!hot && activityStatus !== PROJECT_ACTIVITY_STATUS.activityNotStarted,
    [activityStatus, hot],
  );

  const leftBgImg = useMemo(() => {
    if (isPC) {
      return BANNER_BG_MAP.left;
    }
    if (isPad) {
      return BANNER_BG_MAP.leftPad;
    }
    return BANNER_BG_MAP.leftH5;
  }, [isPad, isPC]);

  return (
    <ThemeProvider theme="dark">
      <Wrap>
        <Content>
          <BannerTextWrap>
            <LeftBg
              src={leftBgImg}
              className="horizontal-flip-in-arabic"
              alt="background image in banner"
            />

            <BreadCrumb />
            <Title>
              {_tHTML('6b38439bb17f4000a403', {
                num: numberFormat({
                  number: displayAmount || 0,
                  lang: currentLang,
                }),
                coin: rewardCurrency,
              })}
              {isShowHot && (
                <HotAmount className="horizontal-flip-in-arabic" isRTL={isRTL}>
                  <div className="inner-wrap">
                    <section>
                      <img className="hot-icon" alt="hot-icon" src={hotIcon} />
                      {/* 文字再次反转，与父节点取反 */}
                      <span className="horizontal-flip-in-arabic">
                        {formatHotAmount({ value: hot, lang: currentLang })}
                      </span>
                    </section>
                  </div>
                </HotAmount>
              )}
            </Title>
            <DescText>{_t('9afc72fa94094000ac7c')}</DescText>
            {!!(startTime && endTime) && (
              <DescTimeText>
                <DateTimeUTCFormat
                  date={startTime}
                  lang={currentLang}
                  options={{ second: undefined }}
                >
                  {startTime}
                </DateTimeUTCFormat>
                -
                <DateTimeUTCFormat
                  date={endTime}
                  lang={currentLang}
                  options={{ second: undefined }}
                >
                  {endTime}
                </DateTimeUTCFormat>
                (UTC+0)
              </DescTimeText>
            )}
            <ButtonGroup style={{ marginTop: 40, zIndex: 99 }} />
          </BannerTextWrap>
          <OuterContentWrap>
            <EnhanceLayoutRightCoinIcon isRTL={isRTL} isBottomCardLayout={isBottomCardLayout} />

            {!isBottomCardLayout && contentNode}
          </OuterContentWrap>
        </Content>
        {isBottomCardLayout && <PadBottomCardWrap>{contentNode}</PadBottomCardWrap>}
      </Wrap>
    </ThemeProvider>
  );
};

export default DetailBanner;
