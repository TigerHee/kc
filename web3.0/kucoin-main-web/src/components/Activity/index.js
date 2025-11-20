/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'components/Router';
import AbsoluteLoading from 'components/AbsoluteLoading';
import { Carousel, styled, withTheme, px2rem } from '@kux/mui';
import { _t } from 'tools/i18n';
import { exposePageStateForSSG } from 'utils/ssgTools';
import { ActivityStatus, SpotlightActivityType } from 'config/base';
import ModalForbid from 'components/Tips/modalForbid';
import clsx from 'clsx';
import { css } from '@emotion/css';
import { trackClick } from 'utils/ga';
import { injectLocale } from '@kucoin-base/i18n';
import siteConfig from 'utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { KUCOIN_HOST } = siteConfig;

const getStyle = ({ breakpoints, colors }) => {
  return {
    ActivityCenter: css`
      width: 100%;
      padding: ${px2rem(24)} ${px2rem(24)} 140px ${px2rem(24)};
      ${breakpoints.down('sm')} {
        padding: ${px2rem(12)} ${px2rem(12)} ${px2rem(82)} ${px2rem(12)};
        padding-bottom: ${px2rem(82)};
      }
      transition: all 0.3s ease-out;
      background: ${colors.overlay};
    `,
    content: css`
      width: 100%;
      max-width: 990px;
      margin: 0 auto;
      transition: all 0.3s ease-out;
    `,
    carousel: css`
      width: 100%;
      height: auto;
      border-radius: 8px;
      overflow: hidden;
      overflow: hidden;
      .resp {
        padding-bottom: 43.74%;
      }
      ${breakpoints.down('sm')} {
        .resp {
          padding-bottom: 63.72%;
        }
      }
    `,
    carouselItem: css`
      overflow: hidden;
      height: 0;
      width: 100%;
      padding-bottom: 43.74%;
      ${breakpoints.down('sm')} {
        padding-bottom: 63.72%;
      }
      cursor: pointer;
      a {
        display: block;
        text-decoration: none;
      }
    `,
    bgDiv: css`
      width: 100%;
      height: 0;
      padding-bottom: 43.74%;
      ${breakpoints.down('sm')} {
        padding-bottom: 63.72%;
      }
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: cover;
    `,
    ActivityList: css`
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      ${breakpoints.up('md')} {
        &:after {
          width: 31.2%;
          content: '';
        }
      }
      ${breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    ActivityItem: css`
      width: 31.2%;
      ${breakpoints.down('sm')} {
        width: 100%;
      }
      height: auto;
      overflow: hidden;
      margin-top: ${px2rem(32)};
      background: ${colors.layer};
      border: 1px solid ${colors.cover2};
      border-radius: 8px;
      box-shadow: 0 2px 4px 0 ${colors.cover2};
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
      .resp {
        padding-bottom: 66%;
        ${breakpoints.down('sm')} {
          padding-bottom: 54%;
        }
      }
    `,
    respBox: css`
      height: 0;
      margin: 0;
      overflow: hidden;
    `,
    itemHead: css`
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
    `,
    tag: css`
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
      }
    `,
    itemFoot: css`
      padding: 10px;
      p {
        margin: 0;
        color: ${colors.text};
        font-size: 15px;
        letter-spacing: 0;
      }
    `,
  };
};

const styleConfig = {
  [ActivityStatus.WAIT_START]: {
    cls: 'wait_start',
    text: 'will.start',
  },
  [ActivityStatus.PROCESSING]: {
    cls: 'processing',
    text: 'in.progress',
  },
  [ActivityStatus.WAIT_REWARD]: {
    cls: 'wait_award',
    text: 'releasing',
  },
  [ActivityStatus.OVER]: {
    cls: 'stop',
    text: 'ended',
  },
};

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

@connect((state) => {
  const { list } = state.activity;
  // const { currentLang } = state.app;
  const { isSub = false } = state.user.user || {};
  return {
    list,
    // currentLang,
    isSub,
  };
})
@withTheme
@injectLocale
export default class Index extends React.Component {
  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch, isSpotlight } = this.props;
    dispatch({
      type: 'activity/pullActivityList',
      payload: {
        page: 1,
        pageSize: isSpotlight ? 30 : 15,
      },
    }).finally(() => {
      exposePageStateForSSG((dvaState) => {
        const activity = dvaState.activity;
        return {
          activity: {
            ...activity,
          },
        };
      });
    });
  };

  componentDidUpdate(prevProps) {
    const { currentLang } = prevProps;
    if (currentLang !== this.props.currentLang) {
      this.getData();
    }
  }

  getPathPrefix = () => {
    const { isSpotlight } = this.props;
    return isSpotlight ? '/spotlight' : '/activity';
  };

  generatorPath = (banner) => {
    const pathPrefix = this.getPathPrefix();
    const { activityId, type, baseCurrency, tokenPath } = banner || {};
    if (type === 14) {
      return addLangToPath(
        `${KUCOIN_HOST}/spotlight_r6/${activityId}${baseCurrency ? `_${baseCurrency}` : ''}`,
      );
    } else if (type === 15) {
      return addLangToPath(
        // 新sp7活动取tokenPath
        `${KUCOIN_HOST}/spotlight7/${tokenPath?.trim() || activityId}}`,
      );
    } else {
      return `${pathPrefix}/${activityId}`;
    }
  };

  handleSensorsSend = (index, url, type = 'banner') => {
    const { isSpotlight } = this.props;
    if (isSpotlight) {
      trackClick([type, String(++index)], { url });
    }
  };

  render() {
    const { list, isSpotlight, isSub = false, theme } = this.props;
    const { breakpoints, colors } = theme;
    if (!list) {
      return <AbsoluteLoading />;
    }
    let showList = [];
    if (isSpotlight) {
      showList = list.filter((item) => _.indexOf(SpotlightActivityType, item.type) > -1);
    } else {
      showList = list.filter((item) => _.indexOf(SpotlightActivityType, item.type) === -1);
    }

    const Banners = showList.slice(0, 4);
    const pathPrefix = this.getPathPrefix();
    const classes = getStyle({ breakpoints, colors });

    return (
      <div data-inspector="activity_page" className={classes.ActivityCenter}>
        <div className={classes.content}>
          {isSub && <ModalForbid />}
          <div data-inspector="activity_page_carousel" className={classes.carousel}>
            <div className={clsx(classes.respBox, 'resp')}>
              <StyledCarousel autoplay={false} arrows={false} dots={true}>
                {Banners.map((banner, idx) => {
                  const bannerURL = this.generatorPath(banner);
                  return (
                    <div className={classes.carouselItem} key={idx}>
                      <Link
                        onClick={() => this.handleSensorsSend(idx, bannerURL, 'banner')}
                        to={bannerURL}
                      >
                        <div
                          className={classes.bgDiv}
                          style={{ backgroundImage: `url('${banner.imageUrl}')` }}
                        />
                      </Link>
                    </div>
                  );
                })}
              </StyledCarousel>
            </div>
          </div>
          <div data-inspector="activity_page_list" className={classes.ActivityList}>
            {showList.map((item, idx) => {
              const { cls, text } = styleConfig[item.status] || {};
              const itemURL = this.generatorPath(item);
              return (
                <div className={classes.ActivityItem} key={idx}>
                  <div className={clsx(classes.respBox, 'resp')}>
                    <Link
                      onClick={() => this.handleSensorsSend(idx, itemURL, 'production')}
                      to={itemURL}
                    >
                      <div
                        className={classes.itemHead}
                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                      >
                        <div className={classes.tag}>
                          <span className={cls}>{_t(text)}</span>
                        </div>
                      </div>
                      <div className={classes.itemFoot}>
                        <p>{item.title}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
