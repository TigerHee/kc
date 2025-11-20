/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowDownOutlined } from '@kux/icons';
import {
  Carousel,
  EmotionCacheProvider,
  Spin,
  styled,
  ThemeProvider,
  useResponsive,
} from '@kux/mui';
import { Link } from 'components/Router';
import indexOf from 'lodash/indexOf';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import ModalForbid from 'src/components/Tips/ModalForbid';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from 'TradeActivity/utils';
import AppHeader from 'TradeActivityCommon/AppHeader';
import { trackClick } from 'utils/ga';
import { exposePageStateForSSG } from 'utils/ssgTools';
import { SpotlightActivityType, styleConfig } from './config';

const EmptyWrapper = styled.div`
  width: 100%;
  .KuxSpin-root {
    margin: 40vh auto 0;
  }
`;

const ActivityCenter = styled.div`
  width: 100%;
  min-height: 70vh;
  padding: 24px 24px 140px 24px;
  background-color: ${(props) => props.theme.colors.overlay};

  .content {
    width: 100%;
    max-width: 990px;
    margin: 0 auto;
    transition: all 0.3s ease-out;
  }

  .carousel {
    width: 100%;
    height: auto;
    overflow: hidden;
    overflow: hidden;
    border-radius: 8px;
    .resp {
      padding-bottom: 43.74%;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 80px 16px;

    .carousel {
      .resp {
        padding-bottom: 63.72%;
      }
    }
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 32px;

  .activityItem {
    width: calc(33% - 20px);
    height: auto;
    overflow: hidden;
    background-color: ${(props) => props.theme.colors.overlay};
    border: 1px solid ${(props) => props.theme.colors.cover4};
    border-radius: 8px;
    box-shadow: 0 2px 4px 4px rgba(0, 0, 0, 0.02);
    cursor: pointer;
    transition: all 0.3s ease-out;
    a {
      display: block;
      text-decoration: none;
    }
    &:hover {
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
      transform: translateY(-5px);
    }
    &:nth-child(3n + 1) {
      margin-left: 0;
    }
    .respBox {
      height: 0;
      margin: 0;
      padding-bottom: 66%;
      overflow: hidden;
    }

    ${(props) => props.theme.breakpoints.down('lg')} {
      width: calc(33% - 16px);
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 100%;

      .respBox {
        padding-bottom: 54%;
      }
    }
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    gap: 24px;
    margin-top: 24px;
  }
`;

const ItemHeadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding-bottom: 44%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  img {
    width: 100%;
    height: auto;
  }

  .tag {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    [dir='rtl'] & {
      right: unset;
      left: 0;
    }
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      color: #ffffff;
      font-size: 14px;
      &.processing {
        background: #01aa78;
      }
      &.wait_start {
        background: #56a4ff;
      }
      &.wait_award {
        background: #fda829;
      }
      &.stop {
        background: #9b9b9b;
      }
      ${(props) => props.theme.breakpoints.down('sm')} {
        font-size: 12px;
      }
    }
  }
`;

const ItemFootWrapper = styled.div`
  padding: 10px;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  letter-spacing: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const MoreText = styled.div`
  padding: 24px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: 14px;
  letter-spacing: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    svg {
      margin-left: 4px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const CarouselItem = styled.div`
  overflow: hidden;
  height: 0;
  width: 100%;
  padding-bottom: 43.74%;
  cursor: pointer;
  border-radius: 8px;
  a {
    display: block;
    text-decoration: none;
  }

  .bg {
    width: 100%;
    height: 0;
    padding-bottom: 43.74%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 63.72%;
    .bg {
      padding-bottom: 63.72%;
    }
  }
`;

const StyledCarousel = styled(Carousel)`
  .kux-slick-dots {
    position: absolute;
    bottom: 12px;
    display: flex !important;
    justify-content: center;
    width: 100%;
    height: 3px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .kux-slick-item {
    display: inline-block;
    width: 16px;
    height: 3px;
    margin: 0 2px;
    background: #fff;
    opacity: 0.3;
    &.kux-slick-active {
      width: 24px;
      opacity: 1;
    }
  }
`;

const emptyArr = [];

const Index = () => {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.spotlight.list, shallowEqual);
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const isSub = useSelector((state) => state.user.user?.isSub);
  const { currentLang, isRTL } = useLocale();
  const [open, setOpen] = useState(false);
  const { sm } = useResponsive();

  // 如果在app内，从app登录返回时，应再次触发init
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  const getData = useCallback(() => {
    dispatch({
      type: 'spotlight/pullActivityList',
      payload: {
        page: 1,
        pageSize: 30,
      },
    });
  }, [dispatch]);

  const generatorPath = useCallback((banner) => {
    const { activityId, type, baseCurrency, tokenPath } = banner || {};
    if (type === 14) {
      return `/spotlight_r6/${activityId}${baseCurrency ? `_${baseCurrency}` : ''}`;
    } else if (type === 15) {
      // 新sp7活动取tokenPath
      return `/spotlight7/${tokenPath?.trim() || activityId}`;
    } else if (type === 16) {
      return `/spotlight_r8/${activityId}${baseCurrency ? `_${baseCurrency}` : ''}`;
    } else {
      return `https://www.kucoin.com/spotlight/${activityId}`;
    }
  }, []);

  const handleLocaleTo = useCallback((index, url, type = 'banner') => {
    trackClick([type, String(++index)], { url });
    locateToUrlInApp(url);
  }, []);

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const listState = dvaState.spotlight.list || [];
      return {
        spotlight: {
          list: listState,
        },
      };
    });
  }, []);

  useEffect(() => {
    getData();
  }, [getData, currentLang]);

  const showList = useMemo(() => {
    if (list && list.length) {
      const _list = list.filter((item) => indexOf(SpotlightActivityType, item.type) > -1);
      return _list.slice(0, !open ? (sm ? 9 : 6) : 30);
    }
    return emptyArr;
  }, [list, open, sm]);

  const Banners = useMemo(() => {
    if (showList && showList.length) {
      return showList.slice(0, 3);
    }
    return emptyArr;
  }, [showList]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <ActivityCenter data-inspector="activity_page">
          {isSub && <ModalForbid />}
          {isInApp ? <AppHeader theme={currentTheme} /> : null}
          {!list || !list.length ? (
            <EmptyWrapper>
              <Spin size="small" />
            </EmptyWrapper>
          ) : (
            <div className="content">
              <div data-inspector="activity_page_carousel" className="carousel">
                <div className="respBox">
                  <StyledCarousel autoplay={false} arrows={false} dots={true}>
                    {Banners.map((banner, idx) => {
                      const bannerURL = generatorPath(banner);
                      return (
                        <CarouselItem key={idx}>
                          <Link
                            onClick={() => handleLocaleTo(idx, bannerURL, 'banner')}
                            to={bannerURL}
                            dontGoWithHref={isInApp}
                            aria-label="banner"
                          >
                            <div
                              className="bg"
                              style={{
                                backgroundImage: `url('${banner.imageUrl}${
                                  !sm ? '?d=1000x490' : ''
                                }')`,
                              }}
                            />
                          </Link>
                        </CarouselItem>
                      );
                    })}
                  </StyledCarousel>
                </div>
              </div>
              <ActivityList data-inspector="activity_page_list">
                {showList.map((item, idx) => {
                  const { cls, text } = styleConfig[item.status] || {};
                  const itemURL = generatorPath(item);
                  return (
                    <div className="activityItem" key={idx} data-inspector={`type-${item.type}`} >
                      <div className="respBox">
                        <Link
                          onClick={() => handleLocaleTo(idx, itemURL, 'production')}
                          to={itemURL}
                          dontGoWithHref={isInApp}
                        >
                          <ItemHeadWrapper
                            style={{
                              backgroundImage: `url(${item.imageUrl}${
                                !sm ? '?d=900x450' : '?d=600x300'
                              })`,
                            }}
                          >
                            <div className="tag">
                              <span className={cls}>{_t(text)}</span>
                            </div>
                          </ItemHeadWrapper>
                          <ItemFootWrapper>{item.title}</ItemFootWrapper>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </ActivityList>
              {!open ? (
                <MoreText>
                  <span onClick={() => setOpen(true)}>
                    {_t('2YyXGzmRgscwyygscEYUgi')} <ICArrowDownOutlined />
                  </span>
                </MoreText>
              ) : null}
              <AppleDisclaim />
            </div>
          )}
        </ActivityCenter>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};

export default memo(Index);
