/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Breadcrumb, styled, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { useCountDown } from 'ahooks';
import { Link } from 'components/Router';
import moment from 'moment';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import { locateToUrlInApp, transformTimeStr } from '../../../utils';
import { POOL_STATUS, REMARK_STATUS_TEXT } from '../../config';

const StyledBanner = styled.div`
  background: ${(props) => props.theme.colors.cover2};
  position: relative;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 16px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: 1200px;
    margin: 0 auto;
    padding: 0;
    padding-bottom: 40px;
  }
`;

const H5ContentWrapper = styled.div`
  .currencyIntro {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .nameWrapper {
      display: flex;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        object-fit: cover;
        border-radius: 24px;
      }

      .name {
        margin: 0;
        margin-right: 8px;
        color: ${(props) => props.theme.colors.text};
        font-weight: 600;
        font-size: 18px;
        font-style: normal;
        line-height: 130%;
      }

      .btn {
        padding: 2px 7px;
        color: ${(props) => props.theme.colors.text60};
        font-weight: 400;
        font-size: 12px;
        font-style: normal;
        line-height: 130%;
        border: 1px solid ${(props) => props.theme.colors.divider8};
        border-radius: 80px;
        cursor: pointer;
      }
    }
    .mark {
      height: 20px;
      margin-left: 20px;
      padding: 2px 4px;
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      line-height: 16px;
      border-radius: 4px;

      &.notStart {
        color: ${(props) => props.theme.colors.complementary};
        background: ${(props) => props.theme.colors.complementary8};
      }

      &.inProcess {
        color: ${(props) => props.theme.colors.textPrimary};
        background: ${(props) => props.theme.colors.primary8};
      }

      &.completed {
        color: ${(props) => props.theme.colors.text60};
        background: ${(props) => props.theme.colors.cover4};
      }
    }
  }
  .data {
    display: flex;
    align-items: center;
    .label {
      flex: 1;
      margin-right: 16px;
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 13px;
      font-style: normal;
      line-height: 130%;
    }
    .value {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .completedValue {
        text-align: right;
      }
      .utc {
        margin-left: 3px;
      }
    }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;

  ${(props) => props.theme.breakpoints.up('sm')} {
    .left {
      display: flex;
      align-items: center;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100px;
        margin-right: 20px;
        background: ${(props) => props.theme.colors.cover4};
        border-radius: 8px;

        img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 40px;
        }
      }

      .currencyIntro {
        flex: 1;
        .nameWrapper {
          display: flex;
          align-items: center;
          h1 {
            display: inline-flex;
            align-items: baseline;
            margin: 0;
          }
          .name {
            margin-right: 6px;
            color: ${(props) => props.theme.colors.text};
            font-weight: 600;
            font-size: 20px;
            font-style: normal;
            line-height: 130%;
          }
          .fullName {
            color: ${(props) => props.theme.colors.text40};
            font-weight: 400;
            font-size: 12px;
            font-style: normal;
            line-height: 130%;
          }

          .mark {
            height: 20px;
            margin-left: 8px;
            padding: 2px 4px;
            font-weight: 500;
            font-size: 12px;
            font-style: normal;
            line-height: 16px;
            border-radius: 4px;

            &.notStart {
              color: ${(props) => props.theme.colors.complementary};
              background: ${(props) => props.theme.colors.complementary8};
            }

            &.inProcess {
              color: ${(props) => props.theme.colors.textPrimary};
              background: ${(props) => props.theme.colors.primary8};
            }

            &.completed {
              color: ${(props) => props.theme.colors.text60};
              background: ${(props) => props.theme.colors.cover4};
            }
          }
        }
        .desc {
          margin-top: 6px;
          color: ${(props) => props.theme.colors.text60};
          font-weight: 400;
          font-size: 14px;
          font-style: normal;
          line-height: 130%;
        }

        .media {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          .mediaItem {
            padding: 2px 7px;
            color: ${(props) => props.theme.colors.text60};
            font-weight: 400;
            font-size: 12px;
            font-style: normal;
            line-height: 130%;
            border: 1px solid ${(props) => props.theme.colors.divider8};
            border-radius: 80px;
            cursor: pointer;
          }
        }
      }
    }

    .bottom {
      margin-top: 24px;
      div.item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &:last-of-type {
          margin-bottom: 0;
        }
        .label {
          flex: 1;
          margin-right: 16px;
          color: ${(props) => props.theme.colors.text60};
          font-weight: 400;
          font-size: 16px;
          font-style: normal;
          line-height: 130%;
        }
        .value {
          display: flex;
          align-items: center;
          color: ${(props) => props.theme.colors.text};
          font-weight: 700;
          font-size: 16px;
          font-style: normal;
          line-height: 130%;

          .completedValue {
            text-align: right;
          }
          .utc {
            margin-left: 3px;
          }
        }

        .timeValue {
          display: flex;
          align-items: center;
          color: ${(props) => props.theme.colors.text60};
          font-weight: 400;
          font-size: 16px;
          font-style: normal;
          line-height: 130%;
        }
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    display: flex;
    align-items: center;

    .left {
      flex: 1;
      margin-right: 80px;
      .logo {
        width: 120px;
        height: 120px;

        img {
          width: 64px;
          height: 64px;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;

      .item {
        margin-bottom: 12px;
        padding: 12px 16px;
        text-align: center;
        background: ${(props) => props.theme.colors.cover2};
        border-radius: 8px;
        .label {
          margin-bottom: 10px;
          color: ${(props) => props.theme.colors.text60};
          font-weight: 400;
          font-size: 14px;
          font-style: normal;
          line-height: 130%;
        }

        .value {
          color: ${(props) => props.theme.colors.text};
          font-weight: 600;
          font-size: 20px;
          font-style: normal;
          line-height: 130%;

          .completedValue {
            font-size: 20px;
          }
          .utc {
            margin-left: 3px;
          }
        }
      }

      .timeValue {
        display: flex;
        align-items: center;
        max-width: 270px;
        color: ${(props) => props.theme.colors.text60};
        font-weight: 400;
        font-size: 14px;
        font-style: normal;
        line-height: 130%;
        text-align: center;
        text-align: left;

        .text {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
`;

const BreadcrumbWrapper = styled.div`
  padding: 0 0 12px;
  margin-bottom: 8px;
  a {
    color: inherit;
    text-decoration: none;
    border: none;
    outline: none;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 16px;
    padding: 26px 0 12px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 32px;
    padding: 26px 0 12px;
  }
`;

const CountDownFullWarpper = styled.div`
  > span {
    display: flex;
    align-items: center;
    .unit {
      margin-right: 8px;
      padding: none;
      color: ${(props) => props.theme.colors.text40};
      background: none;
    }
  }
`;

const emptyArr = [];

const CountDownComp = memo(({ date, currency }) => {
  const dispatch = useDispatch();
  // 倒计时结束重新拉取数据
  const handleDataList = useCallback(() => {
    dispatch({
      type: 'gempool/pullGemPoolProjectDetail',
      payload: {
        currency,
      },
    });
  }, [dispatch, currency]);

  // const countDown = useCountDown();
  // const [days, hours, minutes, seconds] = countDown(date);
  const [__, formattedRes] = useCountDown({
    targetDate: date,
    onEnd: handleDataList,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountDownFullWarpper>
      {_tHTML('01e2c9386a3c4000abdc', {
        day: days,
        hour: transformTimeStr(hours),
        minute: transformTimeStr(minutes),
        second: transformTimeStr(seconds),
      })}
    </CountDownFullWarpper>
  );
});

function Banner() {
  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();
  const { currentLang } = useLocale();

  const currentInfo = useSelector((state) => state.gempool.currentInfo, shallowEqual);

  const {
    earnTokenLogo,
    earnTokenName,
    earnTokenOverview,
    stakingStartTime,
    stakingEndTime,
    earnDistributeTime,
    mediaInfo,
  } = currentInfo || {};

  const medias = useMemo(() => {
    try {
      if (mediaInfo) {
        return JSON.parse(mediaInfo);
      }
      return emptyArr;
    } catch (error) {
      return emptyArr;
    }
  }, [mediaInfo]);

  const status = useMemo(() => {
    if (moment().isBefore(stakingStartTime)) {
      return POOL_STATUS.NOT_START;
    } else if (moment().isAfter(stakingEndTime)) {
      return POOL_STATUS.COMPLETED;
    }
    return POOL_STATUS.IN_PROCESS;
  }, [stakingStartTime, stakingEndTime]);

  const timeComp = useMemo(() => {
    if (status === POOL_STATUS.NOT_START) {
      return (
        <>
          <div className="label">{_t('29ca661c7df34000af5d')}</div>
          <div className="value">
            <CountDownComp date={stakingStartTime} currency={earnTokenName} />
          </div>
        </>
      );
    } else if (status === POOL_STATUS.IN_PROCESS) {
      return (
        <>
          <div className="label">{_t('8ffb741a52e74000a6f8')}</div>
          <div className="value">
            <CountDownComp date={stakingEndTime} currency={earnTokenName} />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="label">{_t('febbfb0a52d84000aed7')}</div>
          <div className="value">
            {stakingStartTime && stakingEndTime ? (
              <div className="completedValue">
                {`${dateTimeFormat({
                  date: stakingStartTime,
                  lang: currentLang,
                  options: { year: undefined, second: undefined, timeZone: 'UTC' },
                })} ~ ${dateTimeFormat({
                  date: stakingEndTime,
                  lang: currentLang,
                  options: { year: undefined, second: undefined, timeZone: 'UTC' },
                })} UTC`}
              </div>
            ) : (
              '--'
            )}
          </div>
        </>
      );
    }
  }, [status, stakingEndTime, stakingStartTime, currentLang, earnTokenName]);

  const handleJump = useCallback(
    (e, url) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();
      if (isInApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(url)}`,
          },
        });
      } else {
        window.open(url);
      }
    },
    [isInApp],
  );

  return (
    <StyledBanner data-inspector="inspector_gempoolDetail_banner" isInApp={isInApp}>
      <ContentContainer>
        {!isInApp && (
          <BreadcrumbWrapper>
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link
                  to="/gempool"
                  onClick={() => locateToUrlInApp('/gempool')}
                  dontGoWithHref={isInApp}
                >
                  {_t('3f14d758f7b84000a527')}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{earnTokenName}</Breadcrumb.Item>
            </Breadcrumb>
          </BreadcrumbWrapper>
        )}

        {!sm ? (
          <H5ContentWrapper>
            <div className="currencyIntro">
              <div className="nameWrapper">
                {!!earnTokenLogo && <LazyImg src={earnTokenLogo} alt="logo" />}
                <h1 className="name">{earnTokenName}</h1>
                <a className="btn" href="#symbolInfo">
                  {_t('16fc8d376bb64000a665')}
                </a>
              </div>
              {!!REMARK_STATUS_TEXT[status] && (
                <span className={`mark ${status}`}>{_t(REMARK_STATUS_TEXT[status])}</span>
              )}
            </div>
            <div className="data">{timeComp}</div>
          </H5ContentWrapper>
        ) : (
          <ContentWrapper>
            <div className="left">
              <div className="logo">
                {!!earnTokenLogo && <LazyImg src={earnTokenLogo} alt="logo" />}
              </div>
              <div className="currencyIntro">
                <div className="nameWrapper">
                  <h1>
                    <span className="name">{earnTokenName}</span>
                  </h1>

                  {!!REMARK_STATUS_TEXT[status] && (
                    <span className={`mark ${status}`}>{_t(REMARK_STATUS_TEXT[status])}</span>
                  )}
                </div>
                <div className="desc">{earnTokenOverview}</div>
                {medias?.length ? (
                  <div className="media">
                    {medias?.map((media, index) => {
                      return (
                        <a
                          className="mediaItem"
                          key={`${media?.mediaName}`}
                          href={media?.value}
                          onClick={(e) => handleJump(e, media?.value)}
                        >
                          {media?.mediaName}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            {lg ? (
              <div className="right">
                <div className="item">{timeComp}</div>
                {status !== POOL_STATUS.COMPLETED && (
                  <div className="timeValue">
                    <span className="text">
                      {_t('4d1a57fac2554000ab44', { time: earnDistributeTime })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bottom">
                <div className="item">{timeComp}</div>
                {status !== POOL_STATUS.COMPLETED && (
                  <div className="item">
                    <div className="label">{_t('48390a605cdd4000a0b2')}</div>
                    <div className="timeValue">
                      <span className="text">
                        {_t('4d1a57fac2554000ab44', { time: earnDistributeTime })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ContentWrapper>
        )}
      </ContentContainer>
    </StyledBanner>
  );
}

export default memo(Banner);
